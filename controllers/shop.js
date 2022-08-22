const Product = require('../models/product');
const Cart = require('../models/cart');




exports.getProducts = (req, res, next)=>{
    Product.fetchAll()
        .then(([rows,fieldData])=>{
            res.render(
                'shop/product-list',
                {
                    path: '/products',
                    prods: rows,
                    pageTitle: 'All Products'
                }
            )
        })
        .catch(err=>console.log(error));
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(([product])=>{
            res.render(
                'shop/product-detail',
                {
                  path: '/products',
                  product: product[0],
                  pageTitle: 'Products Details' 
                }
            )
        })
        .catch(err=>console.log(err));
  };

exports.getIndex = (req, res, next)=>{
    Product.fetchAll()
        .then(([rows,fieldData])=>{
            res.render(
                'shop/index',
                {
                    path: '/products',
                    prods: rows,
                    pageTitle: 'Index Page'
                }
            )
        })
        .catch(err=>{console.log(err)})
    
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
