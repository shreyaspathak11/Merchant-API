const user = require('../models/User');
const jwt = require('jsonwebtoken');

exports.isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (token==='none'){
            return next();
        }
        if (!token) {
            return res.status(401).json({ 
                message: 'You need to login first'
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await user.findById(decoded._id);

        next();
    }   catch (error) {
        return res.status(500).json({ 
            message: error.message,
        });
    }
}
