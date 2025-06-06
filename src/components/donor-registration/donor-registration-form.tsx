
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, UserPlus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ALL_BLOOD_TYPES } from '@/types'; // Removed BloodType as it's inferred
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

// The server action import is removed: import { registerDonor } from "@/actions/donorActions"; 

const donorFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phoneNumber: z.string().regex(/^\d{10}$/, { message: "Must be a 10-digit phone number." }),
  bloodType: z.enum(ALL_BLOOD_TYPES, { required_error: "Please select a blood type." }),
  medicalHistory: z.string().max(500, { message: "Medical history summary must be under 500 characters." }).optional().default(""),
  lastDonationDate: z.date().optional(),
});

type DonorFormValues = z.infer<typeof donorFormSchema>;

export default function DonorRegistrationForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<DonorFormValues>({
    resolver: zodResolver(donorFormSchema),
    defaultValues: {
      name: "",
      phoneNumber: user?.phoneNumber || "",
      medicalHistory: "",
    },
  });

  async function onSubmit(data: DonorFormValues) {
    setIsSubmitting(true);
    console.log("Donor registration data (mock submission):", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    try {
      // Mock success
      toast({
        title: "Registration Submitted! (Mock)",
        description: "Thank you for registering as a blood donor. Your information has been logged to the console.",
      });
      form.reset();
    } catch (error) {
      console.error("Mock form submission error:", error);
      toast({
        title: "An Error Occurred (Mock)",
        description: "Something went wrong during mock submission. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto p-6 sm:p-8 bg-card shadow-xl rounded-lg">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="e.g. 9876543210" {...field} readOnly={!!user?.phoneNumber} />
              </FormControl>
              <FormDescription>
                {user?.phoneNumber ? "Phone number is pre-filled from your login." : "Enter your 10-digit phone number."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bloodType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blood Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your blood type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ALL_BLOOD_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="lastDonationDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Last Donation Date (Optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Your last blood donation date.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="medicalHistory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brief Medical History (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any relevant conditions or medications (e.g., diabetic, on aspirin). Keep it brief."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This helps in emergencies. Max 500 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <UserPlus className="mr-2 h-5 w-5" />}
          Register as Donor
        </Button>
      </form>
    </Form>
  );
}
