
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone, KeyRound, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { handlePhoneNumberSubmit, verifyOtpAndGetUser } from '@/actions/authActions'; // Import server actions

function AuthForm() {
  const [step, setStep] = useState(1); // 1 for phone, 2 for OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading, setCurrentUser } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/dashboard');
    }
  }, [authLoading, user, router]);

  if (authLoading || (!authLoading && user)) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <Skeleton className="h-7 w-3/5 mx-auto" /> {/* Mimics CardTitle */}
            <Skeleton className="h-4 w-4/5 mx-auto mt-2" /> {/* Mimics CardDescription */}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" /> {/* Mimics Label */}
              <Skeleton className="h-10 w-full" /> {/* Mimics Input */}
            </div>
            <Skeleton className="h-10 w-full mt-6" /> {/* Mimics Button */}
          </CardContent>
          <CardFooter className="flex justify-center pt-4">
             <Skeleton className="h-5 w-1/2" /> {/* Mimics Footer link */}
          </CardFooter>
        </Card>
      </div>
    );
  }

  const onSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await handlePhoneNumberSubmit(phoneNumber);
    setIsLoading(false);

    if (result.success) {
      setStep(2);
      toast({ title: "OTP Sent", description: result.message });
    } else {
      toast({ title: "Error", description: result.message || "Failed to send OTP.", variant: "destructive" });
    }
  };

  const onVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await verifyOtpAndGetUser(phoneNumber, otp);
    setIsLoading(false);

    if (result.success && result.user) {
      setCurrentUser(result.user); // Set user in client-side auth context
      toast({ title: "Verification Successful", description: result.message || "Welcome to Lifeline!" });
      router.replace('/dashboard');
    } else {
      toast({ title: "Verification Failed", description: result.message || "Invalid OTP or server error.", variant: "destructive" });
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
            <form onSubmit={onSendOtp} className="space-y-6">
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
            <form onSubmit={onVerifyOtp} className="space-y-6">
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
                    maxLength={6} // Assuming a 6-digit OTP for consistency, though our mock is '123456'
                    className="pl-10 tracking-widest text-center"
                    aria-label="One-Time Password"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Verify OTP & Login
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
