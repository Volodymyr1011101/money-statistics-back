import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middleware/validateBody.js';
import { userSchema } from '../validation/users.js';
import {
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
} from '../controllers/users.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(userSchema),
  ctrlWrapper(registerUserController),
);

authRouter.post(
  '/login',
  validateBody(userSchema),
  ctrlWrapper(loginUserController),
);

authRouter.post('/refresh', ctrlWrapper(refreshUserSessionController));

authRouter.post('/logout', ctrlWrapper(logoutUserController));

export default authRouter;
