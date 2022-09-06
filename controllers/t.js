exports.postCart = async (req, res, next)=>{
   try{
    const {productId} = req.body;
    const cart = await req.user.getCart()
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
