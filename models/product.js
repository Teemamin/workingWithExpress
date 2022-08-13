const path = require('path');
const fs = require('fs');
const pathUtill = require('../util/path');


module.exports = class Product{
    constructor(t){
        this.title = t;
    }

    save(){
        const p = path.join(pathUtill, 'data', 'products.json');
        //fs.readFile:It returns the contents/data stored in file or error if any
        fs.readFile(p, (err, fileContent)=>{
            let products = [];
            if(!err){
                products = JSON.parse(fileContent);
            }
            //pass the instance of the class (its an obj)
            products.push(this);
           
            // fs.writeFile() method is used to asynchronously
            // write the specified data to a file. By default, the file would be replaced if it exists.
            fs.writeFile(p, JSON.stringify(products), (err)=>{
                console.log(err);
            })
        })
    }

    static fetchAll(cb){
        const p = path.join(pathUtill, 'data', 'products.json');
        fs.readFile(p, (err, fileContent)=>{
            if(err){
                cb([]);
            }
            cb(JSON.parse(fileContent));
        })
        
    }
}