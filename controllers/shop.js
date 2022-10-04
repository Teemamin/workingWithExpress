const Product = require('../models/product');
const db = require('../util/database').getDb
// const Cart = require('../models/cart');




exports.getProducts = (req, res, next)=>{
    Product.fetchAll()
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
    Product.fetchAll()
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
        const products = await req.user.getCart()
        return await res.render(
            'shop/cart',
            {
                path: '/cart',
                pageTitle: 'cart',
                products: products
            }
        )
    }catch(err){console.log(err)};
    
}

exports.postDeleteCart = async (req,res,next)=>{
    try{
        const productId = req.body.productId;
        await req.user.deleteItemFromCart(productId)
        return await res.redirect('/cart');
    }catch(err){console.log(err)}
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
 
// exports.getOrders = async (req, res, next)=>{
//     const orders = await req.user.getOrders({include:['products']});
//     console.log(orders)
//     await res.render(
//         'shop/orders',
//         {
//             path: '/orders',
//             pageTitle: 'Orders',
//             orders: orders
//         }
//     )
// }


// exports.getCheckout = (req, res, next)=>{
//     res.render(
//         'shop/checkout',
//         {
//             path: '/checkout',
//             pageTitle: 'Checkout page'
//         }
//     )
// }

// exports.postOrder = async (req,res,next)=>{
//     try{
//         const cart = await req.user.getCart();
//         const products = await cart.getProducts();
//         const order = await req.user.createOrder();
//         await order.addProducts(products.map(product=>{
//             product.orderItem = {quantity:product.cartItem.quantity}
//             return product
//         }));
//         await cart.setProducts(null);
//         await res.redirect('/orders')
//     }catch(err){console.log(err)}

// }
