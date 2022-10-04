const Product = require('../models/product');
const User = require('../models/user');
const db = require('../util/database').getDb;

exports.getPostEditProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    const updatedTittle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;
    const product = new Product(
        updatedTittle,
        updatedPrice,
        updatedImageUrl,
        updatedDescription,
        prodId
    )
    product.save()
    .then(result=>{
        console.log('updated product!')
        res.redirect('/admin/products');
    })
    .catch(err=>console.log.log(err))
}

exports.deleteProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    const userId = req.user._id
    console.log(userId)
    Product.deleteProduct(prodId,userId)
    .then(() => {
        console.log('DESTROYED PRODUCT');
        res.redirect('/admin/products');
      })
      .catch(err => console.log(err));

    // Product.findByPk(prodId)
    // .then(product=>{
    //     return product.destroy();
    // })
    // .then(result=>{
    //     console.log('Product Deleted sucessfully!')
    //     res.redirect('/');
    // })
    // .catch(err=>console.log(err))
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
    const product = new Product(tittle,price,imageUrl,description,null,req.user._id)
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
    //  req.user.getProducts({where:{id:prodId}})
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
             product: product
           });
        })
        .catch(err=>console.log(err));
   
}

exports.getProducts = (req, res, next)=>{
    // req.user.getProducts()
    // let products = db().collection('products').find().toArray()
    Product.fetchAll()
    .then((products)=>{
        res.render('admin/products', 
        {
         prods: products,
         pageTitle: 'Admin Products',
         path: '/admin/products',
         hasProducts: products.length > 0,
         activeShop: true
         })
        })
    .catch(err=>console.log(err))
}