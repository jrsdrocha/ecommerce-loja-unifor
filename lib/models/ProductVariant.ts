import { Schema, models, model } from 'mongoose';

const ProductVariantSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    size: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, trim: true, unique: true, sparse: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

ProductVariantSchema.index({ product: 1, size: 1, color: 1 }, { unique: true });

ProductVariantSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    const obj = ret as any;
    obj.id = obj._id?.toString();
    delete obj._id;
    return obj;
  },
});

export default models.ProductVariant ||
  model('ProductVariant', ProductVariantSchema);
