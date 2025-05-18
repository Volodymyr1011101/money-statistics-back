import express from 'express';

import { authenticate } from '../middleware/authenticate.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getCategoriesController } from '../controllers/categories.js';

const categoriesRouter = express.Router();

categoriesRouter.use(ctrlWrapper(authenticate));

categoriesRouter.get('/', ctrlWrapper(getCategoriesController));

export default categoriesRouter;
