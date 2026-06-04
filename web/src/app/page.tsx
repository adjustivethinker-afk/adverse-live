import { LandingNav } from "@/components/landing/nav";
import { HeroSection } from "@/components/landing/hero";
import { FeaturesSection } from "@/components/landing/features";
import { HowSection } from "@/components/landing/how";
import { FaqSection } from "@/components/landing/faq";
import { LandingFooter } from "@/components/landing/footer";

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <HowSection />
      <FaqSection />
      <LandingFooter />
    </main>
  );
}
