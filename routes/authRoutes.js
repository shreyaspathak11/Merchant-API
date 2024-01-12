const express = require('express');
const router = express.Router();

//import from controllers
const {
    register,
    login,
    logout,
    getSession
} = require('../controllers/authController');



//routes
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/session').get(getSession);


module.exports = router;