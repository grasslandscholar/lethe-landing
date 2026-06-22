import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServiceIntroSection from "@/components/ServiceIntroSection";
import VisionSection from "@/components/VisionSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <ServiceIntroSection />
        <VisionSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
