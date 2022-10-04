const getDb = require('../util/database').getDb;
const ObjectId = require('mongodb').ObjectId;

class User{
    constructor(username,email,cart,_id){
        this.username = username
        this.email = email
        this.cart = cart // cart: items: []
        this._id = _id
    }

    save(){
        const db = getDb();
        return db.collection('users').insertOne(this)
        .then(results=>console.log('user successfully added!'))
        .catch(err=>console.log(err))
    }

    addToCart(product){
        
        const cartProductIndex = this.cart.items.findIndex(cartItem => {
            return cartItem.productId.toString() === product._id.toString();
          });
        const updatedCartItems = [...this.cart.items]
        let newQty = 1
        if(cartProductIndex >= 0){
            //if the product is already in the cart
            newQty = this.cart.items[cartProductIndex].qty + newQty
            updatedCartItems[cartProductIndex].qty = newQty
        }else{
            // add a new product to the cart
            updatedCartItems.push({productId: new ObjectId(product._id), qty:newQty})
        }
        const updatedCart = {items: updatedCartItems}
        const db = getDb();
        return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: {cart: updatedCart} })

    }

    getCart(){
        const db = getDb();
        //maps array of objs and return array of strings (id)
        const productIds = this.cart.items.map(i=>{
            return i.productId
        })
        //mongo give me all the elements wr the id's mentioned in the array (productIds)
        //it returns a cursor with the matching elements, then use toArray to convert that to
        //Js array
        return db.collection('products').find({_id: {$in: productIds}}).toArray()
        .then(products=>{
            //products from the db
            return products.map(p=>{
                return {...p,
                    qty: this.cart.items.find(i=>{
                        //Find an object in an array by one of its properties
                        return i.productId.toString() === p._id.toString()
                    }).qty
                }
            })
        })
    }
    deleteItemFromCart(productId){
        const updatedCartItems = this.cart.items.filter(item=>{
            return item.productId.toString() !== productId.toString()
        })
        const db = getDb();
        return db.collection('users').updateOne(
            { _id: new ObjectId(this._id) }, { $set: {cart: {items: updatedCartItems}} })

    }
    static findById(userId){
        const db = getDb();
        return db.collection('users').findOne({_id:new ObjectId(userId)})
        // .then(user=>user)
        // .catch(err=>console.log(err))
      
    }
}

module.exports = User;