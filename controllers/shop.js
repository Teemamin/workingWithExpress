const Product = require('../models/product');
const Cart = require('../models/cart');




exports.getProducts = (req, res, next)=>{
    Product.findAll()
    .then((products)=>{
        res.render(
            'shop/product-list',
            {
                path: '/products',
                prods: products,
                pageTitle: 'All Products'
            }
        )
    })
    .catch(err=>console.log(err))
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
        .then((product)=>{
            res.render(
                'shop/product-detail',
                {
                  path: '/products',
                  product: product,
                  pageTitle: 'Products Details' 
                }
            )
        })
        .catch(err=>console.log(err));
  };

exports.getIndex = (req, res, next)=>{
    Product.findAll()
        .then((products)=>{
            res.render(
                'shop/index',
                {
                    path: '/products',
                    prods: products,
                    pageTitle: 'Index Page'
                }
            )
        })
        .catch(err=>console.log(err))
    
}

exports.getCart = (req, res, next)=>{
    req.user.getCart()
    .then((cart)=>{
       return cart.getProducts()
        .then(products=>{
            res.render(
                'shop/cart',
                {
                    path: '/cart',
                    pageTitle: 'cart',
                    products: products
                }
            )
        })
        .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));
    
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
    let fetchedCart;
    req.user.getCart()
    .then(cart=>{
        //to make sure cart is available to the entire function
        fetchedCart = cart
       return cart.getProducts({where:{id: prodId}})
    })
    .then(products=>{
        let product;
        if(products.length > 0){
            product = products[0]
        }
        let newQty = 1
        if(product){
            //if the product is already in the cart
            const oldQty = product.cartItem.quantity
            newQty = oldQty + 1
            return fetchedCart.addProduct(product,{through:{quantity:newQty}})
        }
        //if it reaches here, that means the product is not in the cart yet
        return Product.findByPk(prodId).then(prdct=>{
            //addProduct is a method provided by sequelize for manytomany relshp
            return fetchedCart.addProduct(prdct,{through: {quantity: newQty}})
        }).catch(err=>console.log(err))
    })
    .then(()=>{
        res.redirect('/cart')
    })
    .catch(err=>console.log(err))
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
