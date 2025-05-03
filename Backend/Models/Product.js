
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  oldPrice: { type: Number, required: true },
  newPrice: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  type:{type:String,required:true}
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
