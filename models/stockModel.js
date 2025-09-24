const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
    trim: true,
  },
  productType: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: String,
    required: true,
    trim: true,
  },
  quality: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: String,
    required: true,
  },
  sellingPrice: {
    type: String,
    required: true,
  },
  supplier: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('StockModel', stockSchema);
