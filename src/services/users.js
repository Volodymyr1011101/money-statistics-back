import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';

import { RANDOM_BYTES, THIRTY_DAYS, ONE_DAY } from '../constants/index.js';
import UserCollection from '../db/models/user.js';
import { SessionCollection } from '../db/models/sessions.js';

export const registerUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (user) throw createHttpError.Conflict('Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  return await UserCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

const createSession = () => {
  const accessToken = randomBytes(RANDOM_BYTES).toString('hex');
  const refreshToken = randomBytes(RANDOM_BYTES).toString('hex');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ONE_DAY),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const loginUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (!user) throw createHttpError.NotFound('User not found.');

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) throw createHttpError.Unauthorized('Unauthorized user.');

  await SessionCollection.deleteMany({ userId: user._id });
  const newSession = createSession();

  return await SessionCollection.create({ userId: user._id, ...newSession });
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) throw createHttpError.Unauthorized('Session not found');

  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    throw createHttpError.Unauthorized('Session token expired');
  }

  const newSession = createSession();
  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const getUserById = async (userId) => {
  return await UserCollection.findById(userId);
};

export const updateUser = async (filter, payload, options = {}) => {
  const rawResult = await UserCollection.findOneAndUpdate(filter, payload, {
    includeResultMetadata: true,
    ...options,
  });

  if (!rawResult || !rawResult.value) return null;

  return rawResult.value;
};
