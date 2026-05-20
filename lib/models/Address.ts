import { Schema, models, model } from 'mongoose';

const AddressSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    label: {
      type: String,
      trim: true,
      default: 'Principal',
    },
    street: { type: String, required: true, trim: true },
    number: { type: String, required: true, trim: true },
    complement: { type: String, default: '', trim: true },
    neighborhood: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    cep: { type: String, required: true, trim: true },
    primary: { type: Boolean, default: false },
  },
  { timestamps: true },
);

AddressSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    const obj = ret as any;
    obj.id = obj._id?.toString();
    delete obj._id;
    return obj;
  },
});

export default models.Address || model('Address', AddressSchema);
