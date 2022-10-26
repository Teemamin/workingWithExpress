const Product = require('../models/product');
// const User = require('../models/user');
// const db = require('../util/database').getDb;

exports.getPostEditProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    const updatedTittle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;
    Product.findById(prodId)
    .then(product=>{
        //here product will be a full mongoose obj with all the methods availble
        product.tittle = updatedTittle
        product.price = updatedPrice
        product.imageUrl = updatedImageUrl
        product.description = updatedDescription
//calling save will do an updated behind the scenes not create a new objct
        product.save()
    })  
    .then(result=>{
        console.log('updated product!')
        res.redirect('/admin/products');
    })
    .catch(err=>console.log.log(err))
}

exports.deleteProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    const userId = req.session.user._id
    console.log(userId)
    Product.findByIdAndRemove(prodId)
    .then(() => {
        console.log('DESTROYED PRODUCT');
        res.redirect('/admin/products');
      })
      .catch(err => console.log(err));

}

exports.getAddProduct = (req, res, next)=>{
    res.render('admin/edit-product',
     {
      pageTitle: 'Add product',
      path: '/admin/add-product',
      activeAddProduct: true,
      editing: false,
      isAuthenticated: req.session.isLoggedIn
    });
}

exports.postAddProduct = (req, res, next)=>{
    const tittle = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product({
        tittle:tittle,
        price: price,
        imageUrl: imageUrl,
        description: description,
        userId: req.user,
        isAuthenticated: req.session.isLoggedIn
    })
    product.save()
    .then(result=>{
        console.log('Product successfully created')
        res.redirect('/admin/products')
    })
        .catch(err=>console.log(err))
}

exports.getEditProduct = (req, res, next)=>{
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');  
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then( product=>{
            if(!product){
                return res.redirect('/')
            }
    
            res.render('admin/edit-product',
            {
             pageTitle: 'Edit product',
             path: '/admin/edit-product',
             editing: editMode,
             product: product,
             isAuthenticated: req.session.isLoggedIn
           });
        })
        .catch(err=>console.log(err));
   
}

exports.getProducts = (req, res, next)=>{
    // req.user.getProducts()
    Product.find()
    .then((products)=>{
        // console.log(products)
        res.render('admin/products', 
        {
         prods: products,
         pageTitle: 'Admin Products',
         path: '/admin/products',
         hasProducts: products.length > 0,
         activeShop: true,
         isAuthenticated: req.session.isLoggedIn
         })
        })
    .catch(err=>console.log(err))
}