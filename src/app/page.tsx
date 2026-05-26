import { LandingNav } from "@/components/landing/nav";
import { UrgencyBar } from "@/components/landing/urgency-bar";
import { Hero } from "@/components/landing/hero";
import { Comparison } from "@/components/landing/comparison";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Benefits } from "@/components/landing/benefits";
import { Testimonials } from "@/components/landing/testimonials";
import { Bonus } from "@/components/landing/bonus";
import { Pricing } from "@/components/landing/pricing";
import { FinalCta } from "@/components/landing/final-cta";
import { Faq } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <>
      <UrgencyBar />
      <LandingNav />
      <main>
        <Hero />
        <Comparison />
        <HowItWorks />
        <Benefits />
        <Testimonials />
        <Bonus />
        <Pricing />
        <FinalCta />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
