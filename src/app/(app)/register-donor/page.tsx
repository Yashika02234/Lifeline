import DonorRegistrationForm from '@/components/donor-registration/donor-registration-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function RegisterDonorPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Become a Lifesaver</CardTitle>
          <CardDescription className="text-lg">
            Register as a blood donor and help save lives in your community.
            Your information will be kept confidential and used only for matching with those in need.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DonorRegistrationForm />
        </CardContent>
      </Card>
    </div>
  );
}
