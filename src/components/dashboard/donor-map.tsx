"use client";

import type { Donor } from '@/types';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Droplets, Phone } from 'lucide-react';

interface DonorMapProps {
  donors: Donor[];
  center?: { lat: number; lng: number };
}

// IMPORTANT: User needs to set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in their .env.local file
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export default function DonorMap({ donors, center = { lat: 28.6139, lng: 77.2090 } }: DonorMapProps) {
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Check if API key is available
    if (API_KEY) {
        setMapReady(true);
    } else {
        console.warn("Google Maps API Key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.");
    }
  }, []);


  if (!mapReady) {
    return (
        <Card className="h-[400px] w-full flex items-center justify-center bg-muted/50">
            <CardContent className="text-center">
                <p className="text-muted-foreground">Loading map...</p>
                {!API_KEY && <p className="text-xs text-destructive mt-2">Google Maps API Key is missing. Map functionality will be limited.</p>}
            </CardContent>
        </Card>
    );
  }
  
  return (
    <APIProvider apiKey={API_KEY}>
      <div style={{ height: '400px', width: '100%' }} className="rounded-lg overflow-hidden shadow-lg border">
        <Map
          defaultCenter={center}
          defaultZoom={11}
          mapId="lifeline-map"
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {donors.map((donor) => (
            <AdvancedMarker
              key={donor.id}
              position={{ lat: donor.latitude, lng: donor.longitude }}
              onClick={() => setSelectedDonor(donor)}
            >
              <Pin
                background={'hsl(var(--primary))'}
                borderColor={'hsl(var(--primary-foreground))'}
                glyphColor={'hsl(var(--primary-foreground))'}
              />
            </AdvancedMarker>
          ))}

          {selectedDonor && (
            <InfoWindow
              position={{ lat: selectedDonor.latitude, lng: selectedDonor.longitude }}
              onCloseClick={() => setSelectedDonor(null)}
              minWidth={200}
            >
              <div className="p-2">
                <h3 className="font-headline text-md font-semibold">{selectedDonor.name}</h3>
                <p className="text-sm flex items-center"><Droplets className="h-3 w-3 mr-1 text-primary" />{selectedDonor.bloodType}</p>
                <p className="text-sm flex items-center"><Phone className="h-3 w-3 mr-1 text-primary" />{selectedDonor.phone}</p>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
