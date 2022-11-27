const express = require('express');
const router = express.Router();
const {check, body } = require('express-validator');
const User = require('../models/user');


const authController = require('../controllers/auth');

router.post('/signup',
    [
        check('email').isEmail().withMessage('Please Enter a Valid Email').normalizeEmail().
        custom((value,{req})=>{
            return User.findOne({email:value})
            .then(userDoc=>{
                if(userDoc){
                   return  Promise.reject('Email  aready exist, please find another one');
                }
            })
        }),
        //passing the error message  as second args to body, make it the default message if thr is an err
        body('password', 'Please Enter password with only numbers and text and min 5 char')
        .isLength({min:5}).isAlphanumeric().trim(),
        //this checks for equality of 2 fields
        //custom is my custom func
        body('confirmPassword').trim().custom((value, {req})=>{
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
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password', 'Please enter a valid password min of 5 char').isLength({min:5}).trim()
 ]
,authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/reset', authController.getPasswordReset);
router.post('/reset', authController.postPasswordReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);




module.exports = router;