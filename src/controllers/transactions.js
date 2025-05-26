import TransactionCollection from '../db/models/transaction.js';
import {parsePaginationParams} from "../utils/parsePaginationParams.js";
import {getAllTransactionsService} from "../services/transactions.js";
import UserCollection from "../db/models/user.js";
import {calculateBalance} from "../utils/balanceCalculate.js";
import {colors} from "../constants/index.js";

export const createTransactionController = async (req, res) => {
    try {
        const {type, category, sum, date, comment} = req.body;
        const userId = req.user._id;

        if (!type || !category || !sum || !date) {
            return res.status(400).json({message: 'Обов’язкові поля відсутні'});
        }
        const user = await UserCollection.findOne({_id: userId});
        const balance = calculateBalance(user.balance, sum, type);

        await UserCollection.findOneAndUpdate({_id: userId}, balance, {
            new: true,
        });

        if (sum <= 0 || sum > 1000000) {
            return res
                .status(400)
                .json({message: 'Сума має бути більше 0 та менше 1000000'});
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
        res.status(500).json({message: error.message});
    }
};

export const getTransactionsController = async (req, res) => {
    try {
        const {period, type} = req.query;
        const userId = req.user._id;

        if (!period || !/^\d{4}-\d{2}$/.test(period)) {
            return res
                .status(400)
                .json({message: 'Invalid period format. Use YYYY-MM'});
        }

        const [year, month] = period.split('-').map(Number);
        const start = new Date(Date.UTC(year, month - 1, 1));
        const end = new Date(Date.UTC(year, month, 1));

        const stats = await TransactionCollection.aggregate([
            {
                $match: {
                    userId,
                    date: {$gte: start, $lt: end},
                    type
                },
            },
        ]);

        const result = Object.values(
            stats.reduce((acc, item) => {
                if (!acc[item.category]) {
                    acc[item.category] = {
                        category: item.category,
                        total: 0,
                    };
                }
                acc[item.category].total += item.sum;
                return acc;
            }, {})
        );

        result.map((item, index) => {
           item.color = colors[index];
        });

        const totalSum = result.reduce((sum, item) => sum + item.total, 0);

        res.json({period, result, total: totalSum});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getAllTransactionsController = async (req, res) => {
    const paginationParams = parsePaginationParams(req.query);
    const userId = req.user._id;
    const result = await getAllTransactionsService({...paginationParams, userId });

    res.status(200).json({message: 'Success received transactions' ,result});
};

export const updateTransactionController = async (req, res) => {
    try {
        const {type, category, sum, date, comment} = req.body;
        const {id} = req.params;

        if (sum && (sum <= 0 || sum > 1000000)) {
            return res
                .status(400)
                .json({message: 'Сума має бути більше 0 та менше 1000000'});
        }

        const updatedTransaction = await TransactionCollection.findByIdAndUpdate(
            id,
            {type, category, sum, date, comment},
            {new: true},
        );

        if (!updatedTransaction) {
            return res.status(404).json({message: 'Транзакція не знайдена'});
        }

        if(sum) {
            const user = await UserCollection.findOne({_id: updatedTransaction.userId});
            const newBalance = calculateBalance(user.balance, sum, type);
            await UserCollection.findOneAndUpdate({_id: user._id}, newBalance, {new: true});

        }
        res.status(200).json(updatedTransaction);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const deleteTransactionController = async (req, res) => {
    try {
        const {id} = req.params;
        const deletedTransaction = await TransactionCollection.findByIdAndDelete(
            id,
        );

        if (!deletedTransaction) {
            return res.status(404).json({message: 'Транзакція не знайдена'});
        }

        res.status(200).json({message: 'Транзакція видалена'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
