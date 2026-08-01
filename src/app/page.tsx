import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServiceIntroSection from "@/components/ServiceIntroSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import FloatingProductCTA from "@/components/FloatingProductCTA";
import PrivacyModal from "@/components/PrivacyModal";
import LandingAnalytics from "@/components/LandingAnalytics";

export default function Home() {
  return (
    <>
      <LandingAnalytics />
      <Navigation />
      <main>
        <HeroSection />
        <ServiceIntroSection />
        <CTASection />
      </main>
      <FloatingProductCTA />
      <Footer />
      <PrivacyModal />
    </>
  );
}
