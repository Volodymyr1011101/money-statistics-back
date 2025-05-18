import jwt from 'jsonwebtoken';
import { ENV_VARS, JWT } from '../constants/index.js';
import { getEnvVariable } from './getEnvVariable.js';

export const generateJwtToken = (id, email) => {
  return jwt.sign(
    {
      sub: id,
      email,
    },
    getEnvVariable(ENV_VARS.JWT_SECRET),
    {
      expiresIn: JWT.EXPIRE_IN,
    },
  );
};
