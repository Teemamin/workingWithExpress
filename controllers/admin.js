const Product = require('../models/product');
const {validationResult } = require('express-validator');
// const User = require('../models/user');
// const db = require('../util/database').getDb;

exports.getPostEditProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    const updatedTittle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(updatedPrice)
        console.log(errors.array())
            return res.status(422).render('admin/edit-product',
            {
             pageTitle: 'Edit product',
             path: '/admin/edit-product',
             editing: true,
             isAuthenticated: req.session.isLoggedIn,
             validationErrors: errors.array(),
             product: {
                tittle: updatedTittle,
                imageUrl: updatedImageUrl,
                price: updatedPrice,
                description: updatedDescription
             },
             hasError: true,
             errorMessage: errors.array()[0].msg
           });

   
    }
    Product.findById(prodId)
    .then(product=>{
        if(product.userId.toString() !== req.user._id.toString()){
            res.redirect('/')
        }
        //here product will be a full mongoose obj with all the methods availble
        product.tittle = updatedTittle
        product.price = updatedPrice
        product.imageUrl = updatedImageUrl
        product.description = updatedDescription
//calling save will do an updated behind the scenes not create a new objct
        product.save()
        .then(result=>{
            console.log('updated product!')
            res.redirect('/admin/products');
        })
    })  
    .catch(err=>console.log(err))
}

exports.deleteProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    const userId = req.session.user._id
    // console.log(userId)
    Product.deleteOne({_id: prodId, userId: req.user._id})
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
      hasError: false,
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: null,
      oldUserInput: {
        tittle: '',
        imageUrl: '',
        price: '',
        description: ''
     },
     validationErrors: []
    });
}

exports.postAddProduct = (req, res, next)=>{
    const tittle = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(422).render('admin/edit-product',
        {
         pageTitle: 'Add product',
         path: '/admin/add-product',
         activeAddProduct: true,
         editing: false,
         isAuthenticated: req.session.isLoggedIn,
         errorMessage: errors.array()[0].msg,
         hasError: true,
        product: {
            tittle: tittle,
            imageUrl: imageUrl,
            price: price,
            description: description
        },
         validationErrors: errors.array()
       });
    }
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
             isAuthenticated: req.session.isLoggedIn,
             validationErrors: [],
             oldUserInput: {
                tittle: '',
                imageUrl: '',
                price: '',
                description: ''
             },
             errorMessage: null
           });
        })
        .catch(err=>console.log(err));
   
}

exports.getProducts = (req, res, next)=>{
    // req.user.getProducts()
    Product.find({userId: req.user._id})
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