const path = require('path');
const fs = require('fs');
const pathUtill = require('../util/path');

const Cart = require('./cart');
const p = path.join(pathUtill, 'data', 'products.json');

const getProductsFromFile = (cb)=>{
    fs.readFile(p, (err, fileContent)=>{
        if(err){
            cb([]);
        }else{
            cb(JSON.parse(fileContent));
        }     
   })    
}



module.exports = class Product{
    constructor(id,title, imageUrl, description, price){
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save(){
       getProductsFromFile(products=>{
           if(this.id){
               const existingProductIndex = products.findIndex(prod => prod.id === this.id)
               const updatedProducts = [...products];
               //if there is an Id, that means the product exists, update the file with the
               //updated version of the product (being called on edit of product)
               updatedProducts[existingProductIndex] = this;
               fs.writeFile(p, JSON.stringify(updatedProducts), (err)=>{
                console.log(err);
               })
           }else{
               //else I do not have an id, so create an Id and push the instance of the class
               // into products and write to file
            this.id = Math.random().toString();
             //pass the instance of the class (its an obj)
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err)=>{
                console.log(err);
            })
           }
       
       })
           
            // fs.writeFile() method is used to asynchronously
            // write the specified data to a file. By default, the file would be replaced if it exists.
    }

    static fetchAll(cb){
        getProductsFromFile(cb);
    }

    static deleteProduct(id){
        getProductsFromFile(products=>{
            const updatedProducts = products.filter(prod=>{
                return prod.id != id
            });

            fs.writeFile(p, JSON.stringify(updatedProducts), (err)=>{
                if(!err){
                    const product = products.find(prod => prod.id === id);
                    Cart.deleteProduct(id,product.price);
                }
               })
        })
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
          const product = products.find(p => p.id === id);
          cb(product);
        });
      }
       
}