const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  tittle: {
    type: String,
    required: true
  },
  price:{
    type: Number,
    required: true
  },
  imageUrl:  {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type:  Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

});

module.exports = mongoose.model('Product', productSchema);

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;
// const ObjectId = require('mongodb').ObjectId;

// class Product{
//     constructor(tittle,price,imageUrl,description,id,userId){
//         this.tittle = tittle
//         this.price = price
//         this.imageUrl = imageUrl
//         this.description = description
//         this._id = id ? new mongodb.ObjectId(id) : null;
//         this.userId = userId;

//     }

    // save(){
    //     const db = getDb();
    //     let dbOp;
    //     if (this._id) {
          // Update the product
    //       dbOp = db
    //         .collection('products')
    //         .updateOne({ _id: this._id }, { $set: this });
    //     } else {
    //       dbOp = db.collection('products').insertOne(this);
    //     }
    //     return dbOp
    //       .then(result => {
    //         console.log(result);
    //       })
    //       .catch(err => {
    //         console.log(err);
    //       });
    // }

    // static fetchAll(){
    //     const db = getDb();
    //     return db.collection('products').find().toArray()
    //     .then(products=>{
            // console.log(products)
    //         return products
    //     })
    //     .catch(err=>console.log(err))
    // }

    // static findById(prodId){
    //     const db = getDb()
    //     return db.collection('products').findOne({_id:new ObjectId(prodId)})
    //     .then(product=>{
            // console.log(product)
    //         return product
    //     })
    //     .catch(err=>console.log(err))
    // }

//     static async deleteProduct(prodId,userId){
//         try{
//             const db = getDb()
//             const productCollection = db.collection('products')
//             const result = await productCollection.deleteOne({_id:new mongodb.ObjectId(prodId)});
//             await db.collection('users').updateOne(
//               { _id: new ObjectId(userId) },
//               {
//                 $pull: {
//                   'cart.items': { productId: new ObjectId(prodId) },
//                 },
//               })
//             if (result.deletedCount === 1) {
//                 console.log("Successfully deleted one document.");
//               } else {
//                 console.log("No documents matched the query. Deleted 0 documents.");
//               }

//         }catch(err){
//             console
//         }
        
//     }

   
// }



// module.exports = Product;