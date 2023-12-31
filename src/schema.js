const mongoose = require('mongoose');


const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  delete: {type:Boolean, default: false}
});

module.exports = mongoose.model('products', ProductSchema);
