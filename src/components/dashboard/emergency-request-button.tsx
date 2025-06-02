"use client";

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';

export default function EmergencyRequestButton() {
  const { toast } = useToast();

  const handleEmergencyRequest = () => {
    // In a real app, this would trigger backend logic
    toast({
      title: "Emergency Request Sent",
      description: "Nearby donors have been notified of your urgent need.",
      variant: "destructive",
      duration: 5000,
    });
  };

  return (
    <Button
      variant="destructive"
      size="lg"
      className="w-full md:w-auto shadow-lg hover:shadow-xl transition-shadow fixed bottom-6 right-6 md:static"
      onClick={handleEmergencyRequest}
    >
      <AlertTriangle className="h-5 w-5 mr-2" />
      Request Blood Urgently
    </Button>
  );
}
