import createHttpError from 'http-errors';

import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
  getUserById,
} from '../services/users.js';

import { COOKIES, HTTP_STATUSES, THIRTY_DAYS } from '../constants/index.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(HTTP_STATUSES.CREATED).json({
    status: HTTP_STATUSES.CREATED,
    message: 'Successfully registered a user!',
    data: user,
  });
};

const setupSession = (res, session) => {
  res.cookie(COOKIES.REFRESH_TOKEN, session.refreshToken, {
    httpOnly: true,
    maxAge: THIRTY_DAYS,
    sameSite: 'None',
    secure: true,
  });
  res.cookie(COOKIES.SESSION_ID, session._id, {
    httpOnly: true,
    maxAge: THIRTY_DAYS,
    sameSite: 'None',
    secure: true,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSession(res, session);

  res.json({
    status: HTTP_STATUSES.OK,
    message: 'Successfully logged in a user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie(COOKIES.SESSION_ID);
  res.clearCookie(COOKIES.REFRESH_TOKEN);

  res.status(HTTP_STATUSES.NO_CONTENT).send();
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: HTTP_STATUSES.OK,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const getUserByIdController = async (req, res, next) => {
  const userId = req.user._id;
  const user = await getUserById(userId);

  if (!user) {
    return next(createHttpError.NotFound('Contact not found'));
  }

  res.status(HTTP_STATUSES.OK).json({
    status: HTTP_STATUSES.OK,
    message: `Successfully found contact with id ${userId}!`,
    data: user,
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.json({
    status: HTTP_STATUSES.OK,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
