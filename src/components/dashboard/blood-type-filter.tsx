import { ALL_BLOOD_TYPES, type BloodType } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Filter, Droplets } from 'lucide-react';

interface BloodTypeFilterProps {
  selectedBloodType: BloodType | 'all';
  onBloodTypeChange: (bloodType: BloodType | 'all') => void;
}

export default function BloodTypeFilter({ selectedBloodType, onBloodTypeChange }: BloodTypeFilterProps) {
  return (
    <div className="flex flex-col space-y-2 p-4 border rounded-lg shadow-sm bg-card">
      <Label htmlFor="blood-type-filter" className="flex items-center text-md font-semibold">
        <Filter className="h-5 w-5 mr-2 text-primary" />
        Filter by Blood Type
      </Label>
      <Select
        value={selectedBloodType}
        onValueChange={(value) => onBloodTypeChange(value as BloodType | 'all')}
      >
        <SelectTrigger id="blood-type-filter" className="w-full">
          <div className='flex items-center'>
            <Droplets className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Select Blood Type" />
          </div>
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
  );
}
