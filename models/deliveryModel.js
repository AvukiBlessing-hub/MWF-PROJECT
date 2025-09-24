const mongoose = require('mongoose');
const deliverySchema = new mongoose.Schema({
  customerName: {
    type: String,
    required:true,
    // trim: true,
  },
  customerAddress: {
    type: String,
    required:true,
    // trim: true,
  },
  productName: {
    type: String,
    required:true,
    unique: true,
    trim: true,
  },
   quantity : {
    type: String,
    required:true,
    },
    paymentType : {
    type: String,
    required:true,
    },
    basePrice: {
        type: String,
        reqired:  true,
    },

    transport: {
        type: String,
        reqired:  true,
    },
     totalPrice: {
        type: String,
        reqired:  true,
    },


});

module.exports = mongoose.model('deliveryModel', deliverySchema);