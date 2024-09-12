const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true, 
  },
  email: {
    type: String,
    unique: true,
    sparse: true, 
  },
  password: {
    type: String,
    required: true, 
  },
  address: {
    type: String,
    required: true, 
  },
  latitude: {
    type: Number, 
    required: true,
  },
  longitude: {
    type: Number, 
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'], 
    default: 'active', 
  },
  modifiedAt: {
    type: Date,
    default: Date.now, 
  },
});

const User = mongoose.model('User', userSchema);
module.exports = { User };
