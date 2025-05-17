import express from 'express';

import authenticate from '../middleware/authenticate.js';
import { getCategories } from '../controllers/categories.js';

const router = express.Router();

router.get('/categories', authenticate, getCategories);

export default router;
