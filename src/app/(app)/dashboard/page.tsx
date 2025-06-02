
"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Donor, BloodType } from '@/types';
import { mockDonors } from '@/lib/mock-data';
import DonorCard from '@/components/dashboard/donor-card';
import UnifiedFilterBar from '@/components/dashboard/unified-filter-bar';
import DonorMap from '@/components/dashboard/donor-map';
import EmergencyRequestButton from '@/components/dashboard/emergency-request-button';
import AiChatAssistant from '@/components/dashboard/ai-chat-assistant';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

export default function DashboardPage() {
  const [selectedBloodType, setSelectedBloodType] = useState<BloodType | 'all'>('all');
  const [selectedDistance, setSelectedDistance] = useState<string>('all'); // 'all', '5', '10', '25', '50'
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setDonors(mockDonors);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredDonors = useMemo(() => {
    let tempDonors = donors;

    // Filter by blood type
    if (selectedBloodType !== 'all') {
      tempDonors = tempDonors.filter(donor => donor.bloodType === selectedBloodType);
    }

    // Filter by distance
    if (selectedDistance !== 'all') {
      const maxDistance = parseInt(selectedDistance, 10);
      tempDonors = tempDonors.filter(donor => donor.distanceKm !== undefined && donor.distanceKm <= maxDistance);
    }

    return tempDonors;
  }, [donors, selectedBloodType, selectedDistance]);

  // For map centering, attempt to use user's location or default
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // Default to Delhi

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.warn("Could not get user location, defaulting map center.");
        }
      );
    }
  }, []);


  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left Panel: Filters and Donor List */}
      <div className="lg:w-1/3 xl:w-1/4 flex flex-col gap-4">
        <UnifiedFilterBar
          selectedBloodType={selectedBloodType}
          onBloodTypeChange={setSelectedBloodType}
          selectedDistance={selectedDistance}
          onDistanceChange={setSelectedDistance}
        />
        <ScrollArea className="h-[calc(100vh-25rem)] lg:h-[calc(100vh-22rem)] border rounded-lg shadow-sm bg-card p-1">
          <div className="p-3 space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="w-full shadow-lg">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))
          ) : filteredDonors.length > 0 ? (
            filteredDonors.map(donor => <DonorCard key={donor.id} donor={donor} />)
          ) : (
            <p className="text-center text-muted-foreground py-10">No donors found matching your criteria.</p>
          )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel: Map and Emergency Button */}
      <div className="lg:w-2/3 xl:w-3/4 flex flex-col gap-6">
        <h2 className="text-2xl font-headline font-semibold">Donor Locations</h2>
        <DonorMap donors={filteredDonors} center={mapCenter} />
        <Separator className="my-4 lg:hidden" />
        <div className="mt-auto pt-4 lg:pt-0 flex flex-col md:flex-row md:items-center md:justify-end gap-4">
          <AiChatAssistant currentBloodTypeFilter={selectedBloodType} />
          <EmergencyRequestButton />
        </div>
      </div>
    </div>
  );
}
