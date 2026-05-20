import { Schema, models, model } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },

    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },

    // Mantido para compatibilidade com o frontend atual.
    course: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },

    // Estrutura mais organizada.
    courseRef: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      default: null,
    },
    categoryRef: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },

    permitsPersonalization: {
      type: Boolean,
      default: false,
    },

    sizes: [{ type: String, trim: true }],
    colors: [{ type: String, trim: true }],

    image: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

ProductSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    const obj = ret as any;
    obj.id = obj._id?.toString();
    delete obj._id;
    return obj;
  },
});

export default models.Product || model('Product', ProductSchema);
