const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);
router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.get('/orders', isAuth, shopController.getOrders);
// router.get('/checkout', shopController.getCheckout);
router.post('/cart-delete-item', isAuth, shopController.postDeleteCart);
router.post('/create-order', isAuth, shopController.postOrder);

module.exports = router;
