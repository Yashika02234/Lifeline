
import mongoose, { Schema, Document, models, Model } from 'mongoose';
import type { BloodType as AppBloodType } from '@/types';
import { ALL_BLOOD_TYPES } from '@/types';

export interface IDonor extends Document {
  name: string;
  phoneNumber: string;
  bloodType: AppBloodType;
  latitude?: number; // Made optional as not all donors might have this initially
  longitude?: number; // Made optional
  lastDonationDate?: Date;
  medicalHistory?: string;
  // address fields can be added later if needed
  // city?: string;
  // state?: string;
  // country?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DonorSchema: Schema<IDonor> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for this donor.'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please provide a phone number.'],
      match: [/^\d{10}$/, 'Phone number must be 10 digits.'],
      // Consider adding unique: true if phone numbers should be unique
    },
    bloodType: {
      type: String,
      required: [true, 'Please provide a blood type.'],
      enum: ALL_BLOOD_TYPES,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    lastDonationDate: {
      type: Date,
    },
    medicalHistory: {
      type: String,
      maxlength: [500, 'Medical history summary cannot be more than 500 characters.'],
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

// Ensure the model is not recompiled if it already exists
const Donor: Model<IDonor> = models.Donor || mongoose.model<IDonor>('Donor', DonorSchema);

export default Donor;
