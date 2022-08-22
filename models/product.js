const db = require('../util/database');

const Cart = require('./cart');


module.exports = class Product{
    constructor(id,title, imageUrl, description, price){
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save(){
        return db.execute('INSERT INTO products (title,price,description,imageUrl) VALUES (?,?,?,?)',
        [this.title,this.price,this.description,this.imageUrl])
    
    }

    static fetchAll(cb){
        return db.execute('SELECT * FROM products')
    }

    static deleteProduct(id){
       
    }

    static findById(id, cb) {
        //the ? is extra security, the val gets added by the sql package we installed
       return db.execute('SELECT * FROM products WHERE products.id = ?',[id]);
    }
       
}