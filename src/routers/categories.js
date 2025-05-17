import express from 'express';

import authenticate from '../middleware/authenticate.js';
import CategoryModel from '../db/models/categories.js';

const router = express.Router();

router.get('/categories', authenticate, async (req, res) => {
  const { type } = req.query;
  const { _id: userId } = req.user;

  if (!['income', 'expense'].includes(type)) {
    return res.status(400).json({ message: 'Invalid type' });
  }

  const categories = await CategoryModel.find({ userId, type });
  res.json({ status: 200, data: categories });
});

export default router;
