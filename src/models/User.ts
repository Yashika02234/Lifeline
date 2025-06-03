
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IUser extends Document {
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    phoneNumber: {
      type: String,
      required: [true, 'Please provide a phone number.'],
      match: [/^\d{10}$/, 'Phone number must be 10 digits.'],
      unique: true,
      trim: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

// Ensure the model is not recompiled if it already exists
const User: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
