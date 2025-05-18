import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getUserByIdController,
  updateUserController,
  updateUserAvatarController,
} from '../controllers/users.js';
import { authenticate } from '../middleware/authenticate.js';
import { updateUserSchema } from '../validation/users.js';
import { validateBody } from '../middleware/validateBody.js';
import { upload } from '../middleware/multer.js';

const userRouter = Router();

userRouter.use(ctrlWrapper(authenticate));

userRouter.get('/', ctrlWrapper(getUserByIdController));

userRouter.patch(
  '/',
  validateBody(updateUserSchema),
  ctrlWrapper(updateUserController),
);

userRouter.patch(
  '/avatar',
  upload.single('avatar'),
  validateBody(updateUserSchema),
  ctrlWrapper(updateUserAvatarController),
);

export default userRouter;
