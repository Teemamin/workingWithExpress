const express = require('express');
const router = express.Router();

const productController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const {check, body } = require('express-validator');

// on routes: you can add as many handlers as you wish and the req will be funneled through them from
//left to right, it calls the next middle ware in action

router.get('/add-product', isAuth, productController.getAddProduct)
router.get('/products', isAuth, productController.getProducts);
router.get('/edit-product/:productId', isAuth, productController.getEditProduct)


router.post('/add-product', [
    body('title').notEmpty().isLength({min:5}).withMessage('Tittle must be a min of 5 char and cannot be empty').trim(),
    body('imageUrl', 'image url cannot be empty and must be a valid URL').notEmpty().isURL().trim(),
    body('price', 'Price has to be a valid number and cannot be empty').notEmpty().isNumeric().trim(),
    body('description', 'description cannot be empty').notEmpty().trim()
] 
,isAuth, productController.postAddProduct)
router.post('/edit-product',  [
    body('title').notEmpty().isLength({min:5}).withMessage('Tittle must be a min of 5 char and cannot be empty').trim(),
    body('imageUrl', 'image url cannot be empty and must be a valid URL').isURL(),
    body('price', 'Price has to be a valid number and cannot be empty').notEmpty().isNumeric().trim(),
    body('description', 'description cannot be empty').isLength({min:5}).notEmpty().trim()
] 
,isAuth, productController.getPostEditProduct);
router.post('/delete-product/', isAuth, productController.deleteProduct);


module.exports = router;
