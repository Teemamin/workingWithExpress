const Product = require('../models/product');

exports.getPostEditProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    const updatedTittle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;
    Product.findByPk(prodId)
    .then(product=>{
        product.tittle = updatedTittle;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDescription;
        product.price = updatedPrice;
        return product.save();
    })
    //the second then would handle sucess for the save()
    //the catch will work for the first and secon then (promise)
    .then(result=>{
        console.log('updated product!')
        res.redirect('/admin/products');
    })
    .catch(err=>console.log.log(err))
}

exports.deleteProduct = (req,res,next)=>{
    const prodId = req.body.productId;

    Product.findByPk(prodId)
    .then(product=>{
        return product.destroy();
    })
    .then(result=>{
        console.log('Product Deleted sucessfully!')
        res.redirect('/');
    })
    .catch(err=>console.log(err))
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
    //req.user is the user instance we setup in app.js which is a sequelze user object
    //sequelize adds the the createProduct method as a result of belongsToMany()
    req.user.createProduct({
        tittle: tittle,
        imageUrl: imageUrl,
        description: description,
        price: price
    }).then(result=>{
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
     req.user.getProducts({where:{id:prodId}})
    // Product.findByPk(prodId)
        .then( products=>{
            const product = products[0]
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
    req.user.getProducts()
    // Product.findAll()
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