const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        user = await User.create({
            name,
            email,
            password
        });

        //create token
        const token = await user.generateToken();

        const options = {
            expires: new Date(
                Date.now()+30*24*60*60*1000
            ),
            httpOnly: true
        };

        res.status(200).cookie('token', token, options).json({
            success: true,
            message: 'User created successfully',
            token,
            user,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


//Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //check if user exists
        const user = await User.findOne({ email })
        .select('+password');                           //select password as it is set to false in the model by default
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            });
        }

        //create token
        const token = await user.generateToken();

        const options = {
            expires: new Date(
                Date.now()+30*24*60*60*1000
            ),
            httpOnly: true
        };

        res.status(200).cookie('token', token, options).json({
            success: true,
            message: 'User logged in successfully',
            token,
            user,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


//Logout
exports.logout = async (req, res) => {
    try {
        res
        .status(200)
        .clearCookie('token')
        .cookie('token', 'none', {
            expires: new Date(Date.now()+10*1000),
            httpOnly: true
        })
        .json({
            success: true,
            message: 'User logged out successfully'
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//Session
exports.getSession = async (req, res) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Unauthorized: No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Unauthorized: Invalid token'
            });
        }

        res.status(200).json({ 
            success: true,
            message: 'Session is valid',
            user,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            success: false,
            message: error.message,
        });
    }
};