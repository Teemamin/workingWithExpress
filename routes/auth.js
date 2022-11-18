const express = require('express');
const router = express.Router();
const {check, body } = require('express-validator');


const authController = require('../controllers/auth');

router.post('/signup',
    [
        check('email').isEmail().withMessage('Please Enter a Valid Email'),
        //passing the error message  as second args to body, make it the default message if thr is an err
        body('password', 'Please Enter password with only numbers and text and min 5 char')
        .isLength({min:5}).isAlphanumeric(),
        //this checks for equality of 2 fields
        //custom is my custom func
        body('confirmPassword').custom((value, {req})=>{
            if(value !== req.body.password){
                throw new Error("Passwords Must Match")
            }
            return true
        })
    ] ,
    
    authController.postSignup
);
router.get('/signup', authController.getSignup);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/reset', authController.getPasswordReset);
router.post('/reset', authController.postPasswordReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);




module.exports = router;