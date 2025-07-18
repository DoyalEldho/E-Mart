const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  price: Number,
  stock: Number, 
  image: String,
  imageId: { type: String },      
  tags: [String],
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
