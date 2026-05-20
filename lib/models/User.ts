import { Schema, models, model } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    phone: { type: String, required: true, trim: true },

    course: { type: String, required: true, trim: true },

    courseRef: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      default: null,
    },

    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true },
);

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    const obj = ret as any;
    obj.id = obj._id?.toString();
    delete obj._id;
    delete obj.password;
    return obj;
  },
});

export default models.User || model('User', UserSchema);
