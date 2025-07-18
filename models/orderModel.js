const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      adminId: {  type: mongoose.Schema.Types.ObjectId,  ref: 'User',  required: true
          },
    }
  ],
  totalPrice: { type: Number, required: true },

   address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },

  paymentMethod: {
    type: String,
    enum: ['Online', 'COD'],
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: Date,
  status: {
    type: String,
    enum: ['processing', 'shipped', 'delivered'],
    default: 'processing'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
