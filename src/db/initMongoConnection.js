import mongoose from 'mongoose';

import { getEnvVariable } from '../utils/getEnvVariable.js';

export const initMongoConnection = async () => {
    try {
        const user = getEnvVariable('MONGODB_USER');
        const pwd = getEnvVariable('MONGODB_PASSWORD');
        const url = getEnvVariable('MONGODB_URL');
        const db = getEnvVariable('MONGODB_DB');

        await mongoose.connect(
            `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`,
        );
        console.log('Mongo connection successfully established!');
    } catch (e) {
        console.log('Error while setting up mongo connection', e);
        throw e;
    }
};
