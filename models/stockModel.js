// StockModel.js
const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
    trim: true
  },
  productType: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true
  },
  quality: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  sellingPrice: {
    type: Number,
    required: true
  },
  supplier: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.StockModel || mongoose.model('StockModel', stockSchema);
