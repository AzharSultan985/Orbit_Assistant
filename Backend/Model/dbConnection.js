import mongoose from 'mongoose'

import dotenv from 'dotenv'
dotenv.config()

const ConnectDB =async ()=>{
    try {
        if (!process.env.MONGODB_URL) {
            throw new Error('Mongodb url is not found ')

        }

const conn = await mongoose.connect(process.env.MONGODB_URL)
console.log('MongoDB connceted Successfully!');



    } catch (error) {
console.error('MongoDB connection failed');
process.exit(1)
        
    }
}
export default ConnectDB