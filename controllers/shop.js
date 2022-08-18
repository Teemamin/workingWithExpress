const Product = require('../models/product');
const Cart = require('../models/cart');




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
    Cart.getCart(cart=>{
        Product.fetchAll(products=>{
            const cartProducts = [];
            for(product of products){
                const cartProductData = cart.products.find(prod=> prod.id === product.id)
                if(cartProductData){
                    cartProducts.push(
                        {productData: product, qty: cartProductData.qty}
                    );
                }
            }
            res.render(
                'shop/cart',
                {
                    path: '/cart',
                    pageTitle: 'cart',
                    products: cartProducts
                }
            )
        });
    });
    
}

exports.postDeleteCart = (req,res,next)=>{
    const productId = req.body.productId;
    Product.findById(productId, product=>{
        Cart.deleteProduct(productId,product.price);
        res.redirect('/cart');
    })
}

exports.postCart = (req, res, next)=>{
    const prodId = req.body.productId;
    Product.findById(
        prodId, product=>{
            Cart.addProduct(prodId, product.price)
        }) 
    res.redirect('/')
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
