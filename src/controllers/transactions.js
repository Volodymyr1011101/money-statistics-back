import TransactionCollection from '../db/models/transaction.js';

export const getTransactionsController = async (req, res) => {
  const { period, userId } = req.query;

  if (!period || !/^\d{4}-\d{2}$/.test(period)) {
    return res
      .status(400)
      .json({ message: 'Invalid period format. Use YYYY-MM' });
  }

  const [year, month] = period.split('-').map(Number);
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));

  const stats = await TransactionCollection.aggregate([
    {
      $match: {
        userId,
        date: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: { type: '$type', category: '$category' },
        totalAmount: { $sum: '$amount' },
      },
    },
    {
      $group: {
        _id: '$_id.type',
        categories: {
          $push: {
            category: '$_id.category',
            total: '$totalAmount',
          },
        },
        total: { $sum: '$totalAmount' },
      },
    },
    {
      $project: {
        _id: 0,
        type: '$_id',
        categories: 1,
        total: 1,
      },
    },
  ]);

  res.json({ period, stats });
};
