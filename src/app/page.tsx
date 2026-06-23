import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServiceIntroSection from "@/components/ServiceIntroSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import PrivacyModal from "@/components/PrivacyModal";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <ServiceIntroSection />
        <CTASection />
      </main>
      <Footer />
      <PrivacyModal />
    </>
  );
}
