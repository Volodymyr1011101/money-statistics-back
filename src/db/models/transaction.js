import {model, Schema} from 'mongoose';

import {handleServerError, setUpdateSettings} from './hooks.js';
import {transactionType} from '../../constants/index.js';

const transactionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: transactionType,
    },
    category: {
        type: String,
        required: true,
    },
    sum: {
        type: Number,
        required: true,
        min: 0,
        max: 1000000,
    },
    date: {
        type: Date,
        required: true,
        set: (val) => {
            return typeof val === 'string' ? new Date(`${val}T00:00:00.000Z`) : val;
        },
    },
    comment: {
        type: String,
        required: false,
        default: '',
    },

});

transactionSchema.post('save', handleServerError);
transactionSchema.pre('findOneAndUpdate', setUpdateSettings);
transactionSchema.post('findOneAndUpdate', handleServerError);

const TransactionCollection = model('transaction', transactionSchema);

export default TransactionCollection;