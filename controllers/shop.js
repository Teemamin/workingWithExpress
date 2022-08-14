Product = require('../models/product');


exports.getProducts = (req, res, next)=>{
    Product.fetchAll(products=>{
        res.render(
            'shop/product-list',
            {
                path: '/products',
                prods: products,
                pageTitle: 'All Products'
            }
        )
    })
}

exports.getIndex = (req, res, next)=>{
    Product.fetchAll(products=>{
        res.render(
            'shop/index',
            {
                path: '/products',
                prods: products,
                pageTitle: 'Index Page'
            }
        )
    })
}

exports.getCart = (req, res, next)=>{
    res.render(
        'shop/cart',
        {
            path: '/cart',
            pageTitle: 'cart'
        }
    )
}

exports.getOrders = (req, res, next)=>{
    res.render(
        'shop/orders',
        {
            path: '/orders',
            pageTitle: 'Orders'
        }
    )
}


exports.getCheckout = (req, res, next)=>{
    res.render(
        'shop/checkout',
        {
            path: '/checkout',
            pageTitle: 'Checkout page'
        }
    )
}