import { json, Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middleware/validateBody.js';

import {
  userSchema,
  sendResetEmailSchema,
  resetPasswordSchema,
} from '../validation/users.js';

import {
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
  sendResetEmailController,
  resetPasswordController,
} from '../controllers/users.js';

const router = Router();
const jsonParser = json();

router.post(
  '/register',
  jsonParser,
  validateBody(userSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  jsonParser,
  validateBody(userSchema),
  ctrlWrapper(loginUserController),
);

router.post('/refresh', ctrlWrapper(refreshUserSessionController));

router.post('/logout', ctrlWrapper(logoutUserController));

router.post(
  '/send-reset-email',
  jsonParser,
  validateBody(sendResetEmailSchema),
  ctrlWrapper(sendResetEmailController),
);

router.post(
  '/reset-pwd',
  jsonParser,
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;
