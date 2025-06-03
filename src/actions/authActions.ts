
'use server';

import * as z from "zod";
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User'; // Assuming you have a User model
import type { User as ClientUserType } from '@/types'; // For the return type to client

const phoneNumberSchema = z.string().regex(/^\d{10}$/, { message: "Must be a 10-digit phone number." });
const otpSchema = z.string().min(4, { message: "OTP must be at least 4 characters."}); // Basic OTP check

export async function handlePhoneNumberSubmit(phoneNumber: string) {
  try {
    const validation = phoneNumberSchema.safeParse(phoneNumber);
    if (!validation.success) {
      return { success: false, message: "Invalid phone number format." };
    }
    // In a real app:
    // 1. Generate OTP
    // 2. Store OTP securely (e.g., Redis, temporary DB collection) with an expiry
    // 3. Send OTP via SMS
    // For this prototype, we'll just simulate success.
    console.log(`Simulating OTP sent to: ${validation.data}`);
    return { success: true, message: `OTP (mock) sent to ${validation.data}. Use 123456.` };
  } catch (error: any) {
    console.error('Error in handlePhoneNumberSubmit:', error);
    return { success: false, message: error.message || 'An unexpected error occurred.' };
  }
}

export async function verifyOtpAndGetUser(phoneNumber: string, otp: string): Promise<{ success: boolean; user?: ClientUserType; message: string }> {
  try {
    const phoneValidation = phoneNumberSchema.safeParse(phoneNumber);
    if (!phoneValidation.success) {
      return { success: false, message: "Invalid phone number format." };
    }
    const otpValidation = otpSchema.safeParse(otp);
    if (!otpValidation.success) {
      return { success: false, message: "Invalid OTP format." };
    }

    // Mock OTP verification
    if (otp !== "123456") {
      return { success: false, message: "Invalid OTP. Please try again." };
    }

    await dbConnect();

    let user = await User.findOne({ phoneNumber });

    if (!user) {
      user = new User({ phoneNumber });
      await user.save();
      console.log(`New user created for phoneNumber: ${phoneNumber}`);
    } else {
      console.log(`User found for phoneNumber: ${phoneNumber}`);
    }
    
    const clientUser: ClientUserType = {
        id: user._id.toString(),
        phoneNumber: user.phoneNumber,
    };

    return { success: true, user: clientUser, message: 'Login successful!' };

  } catch (error: any) {
    console.error('Error in verifyOtpAndGetUser:', error);
    // Check for MongoDB duplicate key error (though findOneAndUpdate handles upsert, direct create might hit this if logic changes)
    if (error.code === 11000) {
        return { success: false, message: 'An error occurred with user data. Please try again.' };
    }
    return { success: false, message: error.message || 'An unexpected error occurred during login.' };
  }
}
