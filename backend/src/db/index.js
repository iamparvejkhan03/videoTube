import mongoose from 'mongoose';
import 'dotenv/config';
import { DATABASE_NAME } from '../constants.js';

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('MongoDB connected successfully'));

        const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${DATABASE_NAME}`);
    } catch (error) {
        console.error('MongoDB connection error', error);
    }
}

export default connectDB;