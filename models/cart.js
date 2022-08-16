const path = require('path');
const fs = require('fs');
const pathUtill = require('../util/path');


const p = path.join(pathUtill, 'data', 'cart.json');

module.exports = class Cart{

    static addProduct(id, productPrice){
        //fetching previous cart
        fs.readFile(p, (err, fileContent)=>{
            let cart = {products: [], totalPrice: 0}
            if(!err){
                cart = JSON.parse(fileContent);
            }
            //Analaze the cart, find existing product
            const existingProductIndex = cart.products.findIndex(prod=> prod.id === id)
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
             //Add new product or increase quantity
            if(existingProduct){
                // the updated product is replaced
                updatedProduct = {...existingProduct}
                updatedProduct.qty = updatedProduct.qty + 1
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct
            }else{
                //newly added productt
                updatedProduct = {id: id, qty: 1}
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + productPrice;

           
        })
    }

}