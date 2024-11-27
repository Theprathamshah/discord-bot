import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

const url = `mongodb+srv://${username}:${password}@kratoscluster.2hnf4.mongodb.net/?retryWrites=true&w=majority&appName=kratoscluster`

export const connectDB = async ()=> {
    try {
        await mongoose.connect(url, {})
        console.log(`Database is connected`);
    } catch (error) {
        console.log(`Error connecting with database: `, error);
        process.exit(1);
    }
}
