const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');
const db = require('../util/database').getDb
// const Cart = require('../models/cart');




exports.getProducts = (req, res, next)=>{
    Product.find()
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
    const prodId = req.params.productId 
    Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
  };

exports.getIndex = (req, res, next)=>{
    Product.find()
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

exports.getCart = async (req, res, next)=>{
    try{
        const products = await req.user.getCart().populate('items.productId')
        // console.log(products.items)
        return await res.render(
            'shop/cart',
            {
                path: '/cart',
                pageTitle: 'cart',
                products: products.items
            }
        )
    }catch(err){console.log(err)};
    
}

exports.postDeleteCart =  (req,res,next)=>{
    // try{
        const productId = req.body.productId;
        console.log(productId)
    //     await req.user.deleteItemFromCart(productId)
    //     return await res.redirect('/cart');
    // }catch(err){console.log(err)}
    req.user.deleteItemFromCart(productId)
    .then(result=>{
        console.log('done')
        res.redirect('/cart');
    }).catch(err=>console.log(err)) 

}

exports.postCart = async (req, res, next)=>{
    try{
        const {productId} = req.body;
        const product = await Product.findById(productId)
        const cart = await req.user.addToCart(product)
        await res.redirect('/cart')
    }catch(err){
        console.log(err)
    }
 }
 
exports.getOrders = async (req, res, next)=>{
    const orders = await req.user.getOrders();
    console.log(orders)
    await res.render(
        'shop/orders',
        {
            path: '/orders',
            pageTitle: 'Orders',
            orders: orders
        }
    )
}


// exports.getCheckout = (req, res, next)=>{
//     res.render(
//         'shop/checkout',
//         {
//             path: '/checkout',
//             pageTitle: 'Checkout page'
//         }
//     )
// }

exports.postOrder = async (req,res,next)=>{
   
    try{
        const cartProducts = await req.user.getCart().populate('items.productId')
        const orderItems = cartProducts.items.map(itm=>{
            return {product: itm.productId, qty:itm.qty}
        })
        const order =  new Order({
            products:orderItems,
            user:{
                username: req.user.username,
                userId: req.user
            }
        })
        await order.save()
        await req.user.clearCart()
        await res.redirect('/orders')
    }catch(err){console.log(err)}

}
