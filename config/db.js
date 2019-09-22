const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

// to connect to db, use mongoose connect
const connectDB = async() => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });

        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        // Exit process with Failure
        process.exit(1);
    }
};

module.exports = connectDB;