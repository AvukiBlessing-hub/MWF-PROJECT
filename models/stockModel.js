const mongoose = require('mongoose');
const stockSchema = new mongoose.Schema({
  product: {
    type: String,
    required:true,
    // trim: true,
  },
  productType: {
    type: String,
    required:true,
    // trim: true,
  },
  quantity: {
    type: String,
    required:true,
    unique: true,
    trim: true,
  },
    price: {
    type: String,
    required:true,
    },
    sellingPrice : {
    type: String,
    required:true,
    },
    supplier: {
        type: String,
        reqired:  true,
    },

    date: {
        type: String,
        reqired:  true,
    },

});

module.exports = mongoose.model('stockmodels', stockSchema);