import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middleware/validateBody.js';
import { authenticate } from '../middleware/authenticate.js';

import { updateUserSchema } from '../validation/users.js';
import {
  countUsersController,
  getUserByIdController,
  patchUserController,
} from '../controllers/users.js';

const router = Router();

router.get('/count', ctrlWrapper(countUsersController));

router.use(authenticate);

export default router;
