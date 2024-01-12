const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './config/.env' });
const connectDB = require('./config/database');

const app = express();

const PORT = process.env.PORT || 5000;
connectDB();


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

//Importing Routes
const auth = require('./routes/authRoutes');
const merchant = require('./routes/merchantRoutes');

//Using Routes
app.use('/auth', auth);
app.use('/api/merchants', merchant)



// serve static assets if in production
app.get('/', (req, res) => {
    res.send('API is running');
    }
);
//listen to port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
