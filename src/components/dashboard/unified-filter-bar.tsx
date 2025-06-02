
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Filter, Droplets, MapPin } from 'lucide-react';
import { ALL_BLOOD_TYPES, type BloodType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UnifiedFilterBarProps {
  selectedBloodType: BloodType | 'all';
  onBloodTypeChange: (bloodType: BloodType | 'all') => void;
  selectedDistance: string;
  onDistanceChange: (value: string) => void;
}

const distanceOptions = [
  { value: 'all', label: 'Any Distance' },
  { value: '5', label: 'Up to 5 km' },
  { value: '10', label: 'Up to 10 km' },
  { value: '25', label: 'Up to 25 km' },
  { value: '50', label: 'Up to 50 km' },
];

export default function UnifiedFilterBar({
  selectedBloodType,
  onBloodTypeChange,
  selectedDistance,
  onDistanceChange,
}: UnifiedFilterBarProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg font-semibold">
          <Filter className="h-5 w-5 mr-2 text-primary" />
          Filter Donors
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-4">
        {/* Blood Type Select */}
        <div className="flex-1 space-y-1">
          <Label htmlFor="blood-type-filter" className="flex items-center text-sm font-medium text-muted-foreground">
            <Droplets className="h-4 w-4 mr-1" />
            Blood Type
          </Label>
          <Select
            value={selectedBloodType}
            onValueChange={(value) => onBloodTypeChange(value as BloodType | 'all')}
          >
            <SelectTrigger id="blood-type-filter" className="w-full">
              <SelectValue placeholder="Select Blood Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Blood Types</SelectItem>
              {ALL_BLOOD_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Distance Select */}
        <div className="flex-1 space-y-1">
          <Label htmlFor="distance-filter" className="flex items-center text-sm font-medium text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            Distance
          </Label>
          <Select
            value={selectedDistance}
            onValueChange={onDistanceChange}
          >
            <SelectTrigger id="distance-filter" className="w-full">
              <SelectValue placeholder="Select Distance Range" />
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
      </CardContent>
    </Card>
  );
}
