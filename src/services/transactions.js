import TransactionCollection from '../db/models/transaction.js';
import {validatePeriodFormat} from '../utils/validatePeriodFormat.js';

export const getAllTransactionsService = async ({page = 1, perPage = 10, userId, period}) => {
    const date = validatePeriodFormat(period);
    const skip = (page - 1) * perPage;


    return TransactionCollection.aggregate([
        {
            $match: {
                userId,
                date: {$gte: date.start, $lt: date.end},
            },
        },
        {$skip: skip},
        {$limit: perPage},
    ]);
};
