import { model, Schema } from 'mongoose';

import {
  contactTypeList,
  phoneNumberPattern,
} from '../../constants/contacts.js';

import { setUpdateOptions, handleSaveError } from './hooks.js';

const contactSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    phoneNumber: {
      type: String,
      match: phoneNumberPattern,
      required: [true, 'Phone number is required'],
    },
    email: String,
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: contactTypeList,
      default: 'personal',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

contactSchema.post('save', handleSaveError);

contactSchema.pre('findOneAndUpdate', setUpdateOptions);
contactSchema.post('findOneAndUpdate', handleSaveError);

export const contactsCollection = model('contact', contactSchema);