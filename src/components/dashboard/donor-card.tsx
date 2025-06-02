import type { Donor } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplets, MapPin, PhoneOutgoing, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DonorCardProps {
  donor: Donor;
}

export default function DonorCard({ donor }: DonorCardProps) {
  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-headline">{donor.name}</CardTitle>
            <CardDescription className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
              {donor.distanceKm ? `${donor.distanceKm} km away` : 'Distance not available'}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-lg bg-primary/10 border-primary text-primary">
            <Droplets className="h-5 w-5 mr-2" />
            {donor.bloodType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <PhoneOutgoing className="h-4 w-4 mr-2 text-accent" />
          <span>{donor.phone}</span>
        </div>
        {donor.lastDonationDate && (
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 mr-2 text-accent" />
            <span>Last Donated: {new Date(donor.lastDonationDate).toLocaleDateString()}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="default" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <PhoneOutgoing className="h-4 w-4 mr-2" />
          Contact Donor
        </Button>
      </CardFooter>
    </Card>
  );
}
