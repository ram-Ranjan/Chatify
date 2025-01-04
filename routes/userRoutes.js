

const User = require('../models/user');

const userController = require('../controllers/userController');
const express = require('express')
const router = express.Router();

router.post('/register',userController.registerUser);

router.post('/login',userController.loginUser);

router.post('/message',userController.addMessage);

router.get('/getAllMessages',userController.getMessages)


module.exports=router;