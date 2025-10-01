// StockModel.js
const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  productType: {
    type: String,
    required: true,
    trim: true
  },
  totalQuantity: {
    type: Number,
    required: true
  },
  availableQuantity: {
    type: Number,
    required: true
  },
  quality: {
    type: String,
    required: true,
    trim: true
  },
  costPrice: {
    type: Number,
    required: true
  },
  sellingPrice: {
    type: Number,
    required: true
  },
  supplierName: {
    type: String,
    required: false
  },
  supplierContact: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.StockModel || mongoose.model('StockModel', stockSchema);
