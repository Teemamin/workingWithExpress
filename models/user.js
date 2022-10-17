const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  cart: {
    items: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            qty: {type: Number, required: true}
        }
    ]
  } 
 
});
userSchema.methods.addToCart = function(product){
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
        updatedCartItems.push({productId: product._id, qty:newQty})
    }
    const updatedCart = {items: updatedCartItems}
    this.cart = updatedCart
    return this.save()

}

userSchema.methods.getCart = function(){
    return this.cart
}

userSchema.methods.deleteItemFromCart = function(productId){
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
      });
      this.cart.items = updatedCartItems;
      return this.save();

}

userSchema.methods.clearCart = function(){
  this.cart = { items: [] };
  return this.save();
}


module.exports = mongoose.model('User', userSchema);
