require('dotenv').config({ path: '.env' });

const mongoose = require('mongoose');
const mongoURI = process.env.DATABASE_STRING;

const connectToMongo = () => {
    mongoose.connect(mongoURI, {
        // useNewUrlParser: true,
        // useCreateIndex: true,
        // useUnifiedTopology: true,
        // useFindAndModify: false
    }).then(() => {
        console.log("connection successful")
    }).catch((err) => console.log(err));
};

module.exports = connectToMongo;
