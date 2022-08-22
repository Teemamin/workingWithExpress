const Product = require('../models/product');

exports.getPostEditProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    const updatedTittle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;
    const product = new Product(prodId,updatedTittle, updatedImageUrl, updatedDescription, updatedPrice);
    product.save()
        .then(()=>res.redirect('/admin/products'))
        .catch(err=>console.log(error));
}

exports.deleteProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    Product.deleteProduct(prodId);
    res.redirect('/');

}

exports.getAddProduct = (req, res, next)=>{
    res.render('admin/edit-product',
     {
      pageTitle: 'Add product',
      path: '/admin/add-product',
      activeAddProduct: true,
      editing: false
    });
}

exports.postAddProduct = (req, res, next)=>{
    const tittle = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(null,tittle, imageUrl, description, price);
    product.save()
    res.redirect('/');
}

exports.getEditProduct = (req, res, next)=>{
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');  
    }
    const prodId = req.params.productId;
    Product.findById(prodId, product=>{
        if(!product){
            return res.redirect('/')
        }

        res.render('admin/edit-product',
        {
         pageTitle: 'Edit product',
         path: '/admin/edit-product',
         editing: editMode,
         product: product
       });
    })
   
}

exports.getProducts = (req, res, next)=>{
    Product.fetchAll((products)=>{
        res.render('admin/products', 
        {
         prods: products,
         pageTitle: 'Admin Products',
         path: '/admin/products',
         hasProducts: products.length > 0,
         activeShop: true
         }
      );

    })
}