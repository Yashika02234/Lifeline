
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { MapPin, LocateFixed } from 'lucide-react';

interface DistanceFilterProps {
  selectedDistance: string; // 'all', '5', '10', '25', '50'
  onDistanceChange: (value: string) => void;
}

const distanceOptions = [
  { value: 'all', label: 'Any Distance' },
  { value: '5', label: 'Up to 5 km' },
  { value: '10', label: 'Up to 10 km' },
  { value: '25', label: 'Up to 25 km' },
  { value: '50', label: 'Up to 50 km' },
];

export default function DistanceFilter({ selectedDistance, onDistanceChange }: DistanceFilterProps) {
  return (
    <div className="flex flex-col space-y-2 p-4 border rounded-lg shadow-sm bg-card">
      <Label htmlFor="distance-filter" className="flex items-center text-md font-semibold">
        <LocateFixed className="h-5 w-5 mr-2 text-primary" />
        Filter by Distance
      </Label>
      <Select
        value={selectedDistance}
        onValueChange={onDistanceChange}
      >
        <SelectTrigger id="distance-filter" className="w-full">
          <div className='flex items-center'>
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Select Distance Range" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {distanceOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
