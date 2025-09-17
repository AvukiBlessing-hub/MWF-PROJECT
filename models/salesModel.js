const mongoose = require('mongoose');
const salesSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required:true,
    // trim: true,
  },
  email: {
    type: String,
    required:true,
    unique: true,
    trim: true,
  },
  salesAgent:{
    type : mangoose.shema.Types.objectId,
    ref:"userModel",
  },
    phone: {
    type: String,
    required:true,
    },
    agentid: {
        type: String,
        reqired:  true,
    },

    username: {
        type: String,
        reqired:  true,
    },
     password: {
        type: String,
        reqired:  true,
    },
});

module.exports = mongoose.model('salesmodels', salesSchema);