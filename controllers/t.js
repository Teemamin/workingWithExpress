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