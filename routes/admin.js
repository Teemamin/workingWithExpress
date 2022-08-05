const path = require('path');
const express = require('express');
const router = express.Router();

const rootDir = require('../util/path');

const products = [];

router.get('/add-product',(req, res, next)=>{
    // console.log('in a middleware two');
    res.render('add-product', {pageTitle: 'Add product', path: '/add-product'});
})

router.post('/product',(req, res, next)=>{
    // console.log(req.body);
    products.push({title: req.body.title});
    res.redirect('/');
})


exports.routes = router;
exports.products = products;
