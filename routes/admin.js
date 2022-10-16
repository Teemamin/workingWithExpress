const path = require('path');
const express = require('express');
const router = express.Router();

const productController = require('../controllers/admin');


router.get('/add-product', productController.getAddProduct)
router.get('/products', productController.getProducts);
router.get('/edit-product/:productId', productController.getEditProduct)


router.post('/add-product', productController.postAddProduct)
router.post('/edit-product', productController.getPostEditProduct);
// router.post('/delete-product/', productController.deleteProduct);


module.exports = router;
