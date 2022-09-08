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

exports.getCart = async (req, res, next)=>{
    try{
        const cart = await req.user.getCart()
        const products = await cart.getProducts()
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
        const cart = await req.user.getCart()
        const product = await cart.getProducts({where:{id:productId}})
        await product[0].cartItem.destroy();
        return await res.redirect('/cart');
    }catch(err){console.log(err)}
}

exports.postCart = async (req, res, next)=>{
    try{
     const {productId} = req.body;
     const cart = await req.user.getCart()
    //  console.log('in cart')
    //  console.log(cart.__proto__)
     const products = await cart.getProducts({where:{id: productId}})
     const chkAddProduct = async ()=>{
      let product;
      if(products.length > 0){
          product = products[0]
      }
      if(product){
          //if the product is already in the cart
          const oldQty = product.cartItem.quantity
          return {product,quantity:oldQty +1}
      }else{
         product= await Product.findByPk(productId)
         return {product, quantity:1}
      }
  
     }
     const {product,quantity} = await chkAddProduct()
     await cart.addProduct(product,{through: {quantity: quantity}})
     await res.redirect('/cart')
    }catch(err){console.log(err)}
 }
 
exports.getOrders = async (req, res, next)=>{
    const orders = await req.user.getOrders({include:['products']});
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


exports.getCheckout = (req, res, next)=>{
    res.render(
        'shop/checkout',
        {
            path: '/checkout',
            pageTitle: 'Checkout page'
        }
    )
}

exports.postOrder = async (req,res,next)=>{
    try{
        const cart = await req.user.getCart();
        const products = await cart.getProducts();
        const order = await req.user.createOrder();
        await order.addProducts(products.map(product=>{
            product.orderItem = {quantity:product.cartItem.quantity}
            return product
        }));
        await cart.setProducts(null);
        await res.redirect('/orders')
    }catch(err){console.log(err)}

}
