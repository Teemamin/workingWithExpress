const getDb = require('../util/database').getDb;
const ObjectId = require('mongodb').ObjectId;

class User{
    constructor(username,email,cart,_id){
        this.username = username
        this.email = email
        this.cart = cart
        this._id = _id
    }

    save(){
        const db = getDb();
        return db.collection('users').insertOne(this)
        .then(results=>console.log('user successfully added!'))
        .catch(err=>console.log(err))
    }

    addToCart(product){
        const updatedCart = {items: [{...product, qty:1}]}
        const db = getDb();
        return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: {cart: updatedCart} })

    }

    static findById(userId){
        const db = getDb();
        return db.collection('users').findOne({_id:new ObjectId(userId)})
        // .then(user=>user)
        // .catch(err=>console.log(err))
      
    }
}

module.exports = User;