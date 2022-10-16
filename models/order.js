const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    products: [
      {
        product: { type: Object, required: true },
        qty: { type: Number, required: true }
      }
    ],
    user: {
      username: {
        type: String,
        required: true
      },
      userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      }
    }
  });
  
  module.exports = mongoose.model('Order', orderSchema);
  