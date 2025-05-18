import { model, Schema } from 'mongoose';

import { handleServerError, setUpdateSettings } from './hooks.js';
import { emailRegex } from '../../constants/index.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: emailRegex,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
      require: false,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

userSchema.post('save', handleServerError);
userSchema.pre('findOneAndUpdate', setUpdateSettings);
userSchema.post('findOneAndUpdate', handleServerError);

const UserCollection = model('user', userSchema);

export default UserCollection;
