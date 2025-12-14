import mongoose from 'mongoose';

const PurchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sweetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sweet', required: true },
  sweetName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true, min: 0 },
  deliveryNote: { type: String, default: '' },
  contactName: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  purchasedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Purchase', PurchaseSchema);
