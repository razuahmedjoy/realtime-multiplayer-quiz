// 
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
        });
        console.log('MongoDB connected...');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);

    }
};

module.exports = connectDB;