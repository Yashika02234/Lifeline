import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award, Gift, Sparkles } from "lucide-react";
import Image from "next/image";

export default function RewardsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="text-center shadow-xl">
        <CardHeader>
          <div className="flex justify-center mb-6">
            <Award className="h-20 w-20 text-primary animate-bounce" />
          </div>
          <CardTitle className="text-4xl font-headline">Donor Rewards & Recognition</CardTitle>
          <CardDescription className="text-xl text-muted-foreground mt-2">
            Your selfless act of donating blood deserves appreciation!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-10 mt-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center">
              <Sparkles className="h-7 w-7 mr-2 text-accent" /> Digital Certificates
            </h2>
            <p className="max-w-2xl mx-auto text-lg">
              Receive a personalized digital certificate after each successful donation. 
              Share your achievement and inspire others!
            </p>
            <div className="mt-6">
              <Image 
                src="https://placehold.co/600x400.png" 
                alt="Sample Donation Certificate" 
                width={600} 
                height={400}
                className="rounded-lg shadow-md mx-auto border"
                data-ai-hint="certificate award"
              />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center">
              <Gift className="h-7 w-7 mr-2 text-accent" /> Upcoming Incentives
            </h2>
            <p className="max-w-2xl mx-auto text-lg">
              We are working on partnering with local businesses to bring you exclusive discounts and perks
              as a token of gratitude for your life-saving contributions. Stay tuned!
            </p>
            <div className="mt-6">
               <Image 
                src="https://placehold.co/300x200.png" 
                alt="Community Partners" 
                width={300} 
                height={200}
                className="rounded-lg shadow-md mx-auto opacity-70"
                data-ai-hint="community handshake"
              />
            </div>
          </section>

          <p className="text-lg font-medium mt-12">
            Thank you for being a hero in someone's story.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
