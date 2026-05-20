import { Schema, models, model } from 'mongoose';

const OrderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    personalization: { type: String, default: '' },
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      cpf: { type: String, default: '' },
      course: { type: String, default: '' },
    },
    items: { type: [OrderItemSchema], required: true },
    deliveryMethod: {
      type: String,
      enum: ['campus', 'delivery'],
      default: 'campus',
    },
    paymentMethod: {
      type: String,
      enum: ['pix', 'credit', 'boleto'],
      default: 'pix',
    },
    shippingAddress: {
      cep: { type: String, default: '' },
      street: { type: String, default: '' },
      number: { type: String, default: '' },
      complement: { type: String, default: '' },
      neighborhood: { type: String, default: '' },
      city: { type: String, default: '' },
    },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        'pending',
        'paid',
        'preparing',
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
