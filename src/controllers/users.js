import createHttpError from 'http-errors';

import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
  getUserById,
  updateUser,
} from '../services/users.js';

import { COOKIES, HTTP_STATUSES, THIRTY_DAYS } from '../constants/index.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import {initializeDefaultCategories} from "../services/categories.js";

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);
  if(user) {
      await initializeDefaultCategories(user._id);
  }
  res.status(HTTP_STATUSES.CREATED).json({
    status: HTTP_STATUSES.CREATED,
    message: 'Successfully registered a user!',
    user,
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
    const {
        _id,
        name,
        email,
        balance,
        avatar,
        accessToken
    } = session;
  setupSession(res, session);
  console.log({accessToken});
  res.json({
    status: HTTP_STATUSES.OK,
    message: 'Successfully logged in a user!',
    data: {
        _id,
        name,
        email,
        balance,
        avatar,
        accessToken
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
    return next(createHttpError.NotFound('User not found'));
  }
    const {_id, email, balance, avatar, name} = user;
  res.status(HTTP_STATUSES.OK).json({
    status: HTTP_STATUSES.OK,
    message: `Successfully found contact with id ${userId}!`,
    data: {_id, email, balance, avatar, name},
  });
};

export const updateUserController = async (req, res) => {
  const { _id: userId } = req.user;

  const user = await updateUser({ _id: userId }, { ...req.body });

  if (!user) {
    return next(createHttpError.NotFound('User not found'));
  }

  res.status(HTTP_STATUSES.OK).json({
    status: HTTP_STATUSES.OK,
    message: 'Successfully patched a user!',
    data: user,
  });
};

export const updateUserAvatarController = async (req, res) => {
  const { _id: userId } = req.user;
  const avatarFile = req.file;

  let avatar = null;

  if (avatarFile) {
    avatar = await saveFileToCloudinary(avatarFile);
  }

  const user = await updateUser({ _id: userId }, { avatar });

  if (!user) {
    return next(createHttpError.NotFound('User not found'));
  }

  res.status(HTTP_STATUSES.OK).json({
    status: HTTP_STATUSES.OK,
    message: 'Successfully updated avatar of the user!',
    data: user,
  });
};
