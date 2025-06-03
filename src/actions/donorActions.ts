
'use server';

import type * as z from "zod";
import dbConnect from '@/lib/dbConnect';
import Donor from '@/models/Donor';
import type { BloodType } from "@/types";

// This schema should ideally match or be derived from your form's Zod schema
// For now, we'll define it based on expected form values.
const donorFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phoneNumber: z.string().regex(/^\d{10}$/, { message: "Must be a 10-digit phone number." }),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as [BloodType, ...BloodType[]], { required_error: "Please select a blood type." }),
  medicalHistory: z.string().max(500, { message: "Medical history summary must be under 500 characters." }).optional(),
  lastDonationDate: z.date().optional(),
});

type DonorFormValues = z.infer<typeof donorFormSchema>;


export async function registerDonor(data: DonorFormValues) {
  try {
    const validation = donorFormSchema.safeParse(data);
    if (!validation.success) {
      // Simplified error handling for brevity. In a real app, you might want to return detailed errors.
      console.error("Validation errors:", validation.error.flatten().fieldErrors);
      return { success: false, message: "Validation failed. Please check your input.", errors: validation.error.flatten().fieldErrors };
    }

    await dbConnect();

    const newDonor = new Donor({
      ...validation.data,
      // Assuming latitude and longitude will be added later or are not part of initial registration
    });

    await newDonor.save();

    return { success: true, message: 'Donor registered successfully!', donorId: newDonor._id.toString() };
  } catch (error: any) {
    console.error('Error registering donor:', error);
    // Check for MongoDB duplicate key error (code 11000) for phone number if it's unique
    if (error.code === 11000 && error.keyPattern && error.keyPattern.phoneNumber) {
        return { success: false, message: 'This phone number is already registered.' };
    }
    return { success: false, message: error.message || 'An unexpected error occurred.' };
  }
}
