const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
    googleId: String,
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number
    }
  ],
  wishlist: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
    }
  ],
 role: {
    type: String,
    enum: ['customer', 'admin'], 
    default: 'customer'
  },
  provider: {
  type: String,
  enum: ['local', 'google'],
  default: 'local'
}
});

module.exports = mongoose.model('User', userSchema);
