const Product = require('../models/product');




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

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
      res.render(
          'shop/product-detail',
          {
            path: '/products',
            product: product,
            pageTitle: 'Products Details' 
          }
      )
    });
  };

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
    console.log(req.body.productId);
    res.render(
        'shop/cart',
        {
            path: '/cart',
            pageTitle: 'cart'
        }
    )
}

exports.getPostCart = (req, res, next)=>{
    const prodId = req.body.productId;
    Product.findById(
        prodId, product=>{
            res.render(
                'shop/cart',
                {
                    path: '/cart',
                    pageTitle: 'cart',
                    product: product
                }
            )
        }) 
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