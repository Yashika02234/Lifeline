import type { Donor, BloodType } from '@/types';

export const mockDonors: Donor[] = [
  {
    id: '1',
    name: 'Aarav Sharma',
    bloodType: 'O+',
    phone: '9876543210',
    latitude: 28.6139, // Delhi
    longitude: 77.2090,
    lastDonationDate: '2024-03-15',
    distanceKm: 2.5,
  },
  {
    id: '2',
    name: 'Priya Singh',
    bloodType: 'A+',
    phone: '9876543211',
    latitude: 28.6200,
    longitude: 77.2150,
    lastDonationDate: '2024-05-01',
    distanceKm: 3.1,
  },
  {
    id: '3',
    name: 'Rohan Mehta',
    bloodType: 'B-',
    phone: '9876543212',
    latitude: 28.6000,
    longitude: 77.2000,
    lastDonationDate: '2023-12-20',
    distanceKm: 1.8,
  },
  {
    id: '4',
    name: 'Sneha Patel',
    bloodType: 'AB+',
    phone: '9876543213',
    latitude: 28.6350,
    longitude: 77.2250,
    distanceKm: 5.0,
  },
  {
    id: '5',
    name: 'Vikram Kumar',
    bloodType: 'O-',
    phone: '9876543214',
    latitude: 28.5950,
    longitude: 77.1950,
    lastDonationDate: '2024-06-10',
    distanceKm: 4.2,
  },
   {
    id: '6',
    name: 'Ananya Reddy',
    bloodType: 'B+',
    phone: '9876543215',
    latitude: 12.9716, // Bangalore
    longitude: 77.5946,
    lastDonationDate: '2024-04-22',
    distanceKm: 8.5, // Assuming user is in Delhi, so this is far
  },
  {
    id: '7',
    name: 'Karan Gupta',
    bloodType: 'A-',
    phone: '9876543216',
    latitude: 12.9750,
    longitude: 77.6000,
    lastDonationDate: '2024-02-11',
    distanceKm: 9.0,
  },
];
