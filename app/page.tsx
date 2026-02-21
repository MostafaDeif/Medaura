import BestClinics from "@/components/home/bestClinics";
import BestDoctors from "@/components/home/bestDoctors";
import Footer from "@/components/footer/footer";
import Hero from "@/components/home/hero";
import HowItWorks from "@/components/home/howItWorks";
import SalesSection from "@/components/home/sales/sales";
import Specialties from "@/components/home/specialties";
import WhatClientSay from "@/components/home/whatClientSay";

export default function Home() {
  return (
    <main className="space-y-16 pb-16 pt-6 sm:pt-8">
      <Hero />
      <SalesSection />
      <Specialties />
      <HowItWorks />
      <BestDoctors />
      <BestClinics />
      <WhatClientSay />
      <Footer />
    </main>
  );
}
