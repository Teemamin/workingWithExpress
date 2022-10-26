const Product = require('../models/product');
const Order = require('../models/order');
// const Cart = require('../models/cart');




exports.getProducts = (req, res, next)=>{
    Product.find()
    .then((products)=>{
        res.render(
            'shop/product-list',
            {
                path: '/products',
                prods: products,
                pageTitle: 'All Products',
                isAuthenticated: req.session.isLoggedIn
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
        pageTitle: product.tittle,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
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
                    pageTitle: 'Index Page',
                    isAuthenticated: req.session.isLoggedIn
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
                products: products.items,
                isAuthenticated: req.session.isLoggedIn
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
    const orders = await Order.find({ 'user.userId': req.user._id })
    console.log(orders)
    await res.render(
        'shop/orders',
        {
            path: '/orders',
            pageTitle: 'Orders',
            orders: orders,
            isAuthenticated: req.session.isLoggedIn
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
            // _doc returns a plain JSON Object. It has no methods or other functions attached. It's just the data. As we don't need any mongoose functions during this call this use case makes sense.
            //It helps lower the overhead on the node server performing this action.
            //with ._doc we get just the data
            return {product: {...itm.productId._doc}, qty:itm.qty}
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
