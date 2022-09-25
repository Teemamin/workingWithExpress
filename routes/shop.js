const path = require('path');

const express = require('express');
const router = express.Router();

const productController = require('../controllers/admin');

const shopController = require('../controllers/shop');


router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);
// router.get('/cart', shopController.getCart);
// router.post('/cart', shopController.postCart);
// router.get('/orders', shopController.getOrders);
// router.get('/checkout', shopController.getCheckout);
// router.post('/cart-delete-item', shopController.postDeleteCart);
// router.post('/create-order', shopController.postOrder);

module.exports = router;
