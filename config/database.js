const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

const connectDB = () => {
mongoose.connect(MONGO_URI, {
}
).then((con) => console.log(`Connected to MongoDB: ${con.connection.host}`))
.catch(err => console.log(err));
};

module.exports = connectDB;
