import { Schema, models, model } from 'mongoose';

const PaymentSchema = new Schema(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['pix', 'credit', 'debit', 'boleto'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'cancelled'],
      default: 'pending',
    },
    provider: {
      type: String,
      default: 'manual',
      trim: true,
    },
    transactionId: {
      type: String,
      default: '',
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

PaymentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    const obj = ret as any;
    obj.id = obj._id?.toString();
    delete obj._id;
    return obj;
  },
});

export default models.Payment || model('Payment', PaymentSchema);
