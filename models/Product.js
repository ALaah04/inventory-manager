const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ref: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  supplier: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['Available', 'Low Stock', 'Out of Stock'], default: 'Available' },
}, { timestamps: true });

productSchema.pre('save', function (next) {
  if (this.quantity === 0) this.status = 'Out of Stock';
  else if (this.quantity < 5) this.status = 'Low Stock';
  else this.status = 'Available';
  next();
});

module.exports = mongoose.model('Product', productSchema);