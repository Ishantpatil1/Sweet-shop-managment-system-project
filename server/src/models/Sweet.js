import mongoose from 'mongoose';

const SweetSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, default: '' },
  description: { type: String, default: '' },
});

export default mongoose.model('Sweet', SweetSchema);
