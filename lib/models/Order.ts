import { Schema, models, model } from 'mongoose';

const OrderItemSchema = new Schema(
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
    productName: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    personalization: { type: String, default: '', trim: true },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const EmbeddedAddressSchema = new Schema(
  {
    street: { type: String, required: true, trim: true },
    number: { type: String, required: true, trim: true },
    complement: { type: String, default: '', trim: true },
    neighborhood: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    cep: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    customer: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      cpf: { type: String, default: '', trim: true },
      course: { type: String, default: '', trim: true },
    },

    items: {
      type: [OrderItemSchema],
      required: true,
      default: [],
    },

    deliveryMethod: {
      type: String,
      enum: ['campus', 'delivery'],
      default: 'campus',
    },

    paymentMethod: {
      type: String,
      enum: ['pix', 'credit', 'debit', 'boleto'],
      default: 'pix',
    },

    address: {
      type: EmbeddedAddressSchema,
      default: null,
    },

    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: [
        'pending',
        'production',
        'ready',
        'shipped',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
    },
  },
  { timestamps: true },
);

OrderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    const obj = ret as any;
    obj.id = obj._id?.toString();
    delete obj._id;
    return obj;
  },
});

export default models.Order || model('Order', OrderSchema);
