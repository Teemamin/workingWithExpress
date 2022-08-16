const path = require('path');
const fs = require('fs');
const pathUtill = require('../util/path');


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
    constructor(title, imageUrl, description, price){
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save(){
        this.id = Math.random().toString();
       getProductsFromFile(products=>{
        //pass the instance of the class (its an obj)
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err)=>{
            console.log(err);
        })
       })
           
            // fs.writeFile() method is used to asynchronously
            // write the specified data to a file. By default, the file would be replaced if it exists.
    }

    static fetchAll(cb){
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
          const product = products.find(p => p.id === id);
          cb(product);
        });
      }
       
}