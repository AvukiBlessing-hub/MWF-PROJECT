const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const signupSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
    role: {    
    type: String,
    required: true,
  },
});

// Tell passport-local-mongoose to use email instead of username
 signupSchema.plugin(passportLocalMongoose,{
  usernameField: "email",
});

module.exports = mongoose.model("UserModel", signupSchema);
