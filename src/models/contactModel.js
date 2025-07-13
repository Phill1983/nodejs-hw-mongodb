import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
   photo: {
  type: new Schema(
    {
      url: { type: String },
      public_id: { type: String },
    },
    { _id: false }
  ),
  default: null,
},
  },
  { timestamps: true }
);

export const Contact = model('Contact', contactSchema);
