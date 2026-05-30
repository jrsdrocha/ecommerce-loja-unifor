import { Schema, models, model } from 'mongoose';

const CartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    variant: {
      type: Schema.Types.ObjectId,
      ref: 'ProductVariant',
      default: null,
    },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    size: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    personalization: { type: String, default: '', trim: true },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const CartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
    subtotal: { type: Number, default: 0, min: 0 },
    updatedAtClient: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

CartSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    const obj = ret as any;
    obj.id = obj._id?.toString();
    delete obj._id;
    return obj;
  },
});

export default models.Cart || model('Cart', CartSchema);
