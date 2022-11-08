const express = require('express');
const router = express.Router();

const productController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

// on routes: you can add as many handlers as you wish and the req will be funneled through them from
//left to right, it calls the next middle ware in action

router.get('/add-product', isAuth, productController.getAddProduct)
router.get('/products', isAuth, productController.getProducts);
router.get('/edit-product/:productId', isAuth, productController.getEditProduct)


router.post('/add-product', isAuth, productController.postAddProduct)
router.post('/edit-product', isAuth, productController.getPostEditProduct);
router.post('/delete-product/', isAuth, productController.deleteProduct);


module.exports = router;
