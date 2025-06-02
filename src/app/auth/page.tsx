"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, KeyRound, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

function AuthForm() {
  const [step, setStep] = useState(1); // 1 for phone, 2 for OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { login, user, loading: authLoading } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/dashboard');
    }
  }, [authLoading, user, router]);

  if (authLoading || (!authLoading && user)) { // Simplified condition to avoid rendering form if auth is loading or user exists
    return null;
  }


  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phoneNumber)) {
      toast({ title: "Invalid Phone Number", description: "Please enter a 10-digit phone number.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    // Simulate OTP sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setStep(2);
    toast({ title: "OTP Sent", description: `An OTP has been sent to ${phoneNumber}. (Hint: use 123456)` });
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) { // Basic OTP length check
        toast({ title: "Invalid OTP", description: "Please enter a valid OTP.", variant: "destructive" });
        return;
    }
    setIsLoading(true);
    const success = await login(phoneNumber, otp);
    setIsLoading(false);
    if (success) {
      toast({ title: "Verification Successful", description: "Welcome to Lifeline!" });
      router.replace('/dashboard');
    } else {
      toast({ title: "Verification Failed", description: "Invalid OTP. Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Welcome to Lifeline</CardTitle>
          <CardDescription>
            {step === 1 ? "Enter your phone number to begin." : `Enter the OTP sent to ${phoneNumber}.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-semibold">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="pl-10"
                    aria-label="Phone Number"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp" className="font-semibold">OTP</Label>
                 <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="pl-10 tracking-widest text-center"
                    aria-label="One-Time Password"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Verify OTP
              </Button>
            </form>
          )}
        </CardContent>
        {step === 2 && (
          <CardFooter className="text-center text-sm">
            <Button variant="link" onClick={() => { setStep(1); setOtp(''); }} className="text-muted-foreground">
              Change phone number?
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}


export default function AuthPage() {
  return <AuthForm />;
}
