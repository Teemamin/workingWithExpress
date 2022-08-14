const Product = require('../models/product');

exports.getAddProduct = (req, res, next)=>{
    res.render('admin/add-product',
     {
      pageTitle: 'Add product',
      path: '/admin/add-product',
      activeAddProduct: true
    });
}

exports.postAddProduct = (req, res, next)=>{
    const tittle = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(tittle, imageUrl, description, price);
    product.save()
    res.redirect('/');
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