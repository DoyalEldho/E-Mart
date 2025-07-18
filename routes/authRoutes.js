const express = require('express');
const authRouter =express.Router();
const auth = require('../middleware/auth');
const { userRegister, userLogin, userInfo, googleSignIn } = require('../controllers/authController');

authRouter.post('/api/register',userRegister);  
authRouter.post('/api/login',userLogin);  
authRouter.get('/api/info',auth,userInfo);
authRouter.post('/api/google', googleSignIn);


module.exports = authRouter;