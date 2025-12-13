import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchase extends Document {
  userId: mongoose.Types.ObjectId;
  sweetId: mongoose.Types.ObjectId;
  sweetName: string;
  quantity: number;
  totalPrice: number;
  deliveryNote?: string;
  contactName?: string;
  contactEmail?: string;
  purchasedAt: Date;
}

const PurchaseSchema = new Schema<IPurchase>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sweetId: { type: Schema.Types.ObjectId, ref: 'Sweet', required: true },
  sweetName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true, min: 0 },
  deliveryNote: { type: String, default: '' },
  contactName: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  purchasedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPurchase>('Purchase', PurchaseSchema);
