import createHttpError from 'http-errors';
import { HTTP_STATUSES } from '../constants/index.js';
import { SessionCollection } from '../db/models/sessions.js';
import UserCollection from '../db/models/user.js';

const { UNAUTHORIZED } = HTTP_STATUSES;

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createHttpError(UNAUTHORIZED, 'Invalid Authorization header'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const session = await SessionCollection.findOne({ accessToken: token });

    if (!session) {
      return next(createHttpError(UNAUTHORIZED, 'Invalid or expired session'));
    }

    const isAccessTokenExpired =
      new Date() > new Date(session.accessTokenValidUntil);

    if (isAccessTokenExpired) {
      return next(createHttpError(UNAUTHORIZED, 'Access token expired'));
    }

    const user = await UserCollection.findById(session.userId);

    if (!user) {
      return next(
        createHttpError(UNAUTHORIZED, 'User associated with session not found'),
      );
    }

    req.user = user;
    req.session = session;

    next();
  } catch (error) {
    next(error);
  }
};
