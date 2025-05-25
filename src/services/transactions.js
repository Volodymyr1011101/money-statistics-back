import TransactionCollection from '../db/models/transaction.js';
import {validatePeriodFormat} from '../utils/validatePeriodFormat.js';

export const getAllTransactionsService = async ({page = 1, perPage = 10, userId}) => {
    const skip = (page - 1) * perPage;

    return TransactionCollection.find({userId}).skip(skip).limit(perPage);
};
