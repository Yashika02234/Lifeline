export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export const ALL_BLOOD_TYPES: BloodType[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export interface Donor {
  id: string;
  name: string;
  bloodType: BloodType;
  phone: string;
  latitude: number;
  longitude: number;
  lastDonationDate?: string; // YYYY-MM-DD
  // For UI purposes, actual distance calculation would be dynamic
  distanceKm?: number; 
}

export interface User {
  id: string;
  phoneNumber: string;
}
