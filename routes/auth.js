const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

router.post('/signup', authController.postSignup);
router.get('/signup', authController.getSignup);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);



module.exports = router;