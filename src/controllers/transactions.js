import TransactionCollection from '../db/models/transaction.js';

export const createTransactionController = async (req, res) => {
  try {
    const { type, category, sum, date, comment, userId } = req.body;

    if (!type || !category || !sum || !date) {
      return res.status(400).json({ message: 'Обов’язкові поля відсутні' });
    }

    if (sum <= 0 || sum > 1000000) {
      return res.status(400).json({ message: 'Сума має бути більше 0 та менше 1000000' });
    }

    const newTransaction = new TransactionCollection({
        userId,
      type,
      category,
        sum,
      date,
      comment,
    });

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactionsController = async (req, res) => {
  try {
    const { period, userId } = req.query;

    if (!period || !/^\d{4}-\d{2}$/.test(period)) {
      return res.status(400).json({ message: 'Invalid period format. Use YYYY-MM' });
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTransactionController = async (req, res) => {
  try {
    const { type, category, amount, date, comment } = req.body;
    const { id } = req.params;

    if (amount && (amount <= 0 || amount > 1000000)) {
      return res.status(400).json({ message: 'Сума має бути більше 0 та менше 1000000' });
    }

    const updatedTransaction = await TransactionCollection.findByIdAndUpdate(
      id,
      { type, category, amount, date, comment },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Транзакція не знайдена' });
    }

    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTransactionController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTransaction = await TransactionCollection.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Транзакція не знайдена' });
    }

    res.status(200).json({ message: 'Транзакція видалена' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
