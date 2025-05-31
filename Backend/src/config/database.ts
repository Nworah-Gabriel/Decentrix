import mongoose from 'mongoose';
import { config } from '../config';

export const connectDB = async (): Promise<void> => {
    try {
        if (!config.mongodbUri) {
            throw new Error('MONGODB_URI environment variable is not set');
        }

        await mongoose.connect(config.mongodbUri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
});