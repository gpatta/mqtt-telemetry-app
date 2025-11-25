import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function connectDB() {
    try {

        const options = {
            user: process.env.MONGO_USERNAME || 'admin',
            pass: process.env.MONGO_PASSWORD,
            authSource: 'admin',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        const mongoURI = `mongodb://${process.env.MONGO_HOST || 'mongodb'}:${process.env.MONGO_PORT || '27017'}/${process.env.MONGO_DATABASE || 'mydb'}`;

        await mongoose.connect(mongoURI, options);
    } catch (err) {
        throw err;
    }
};

export default connectDB;