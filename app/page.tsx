import CoverageSection from "@/components/proof/CoverageSection";
import Contato from "@/components/Contato";
import MidPageCTA from "@/components/conversion/MidPageCTA";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/header/SiteHeader";
import Hero from "@/components/hero/Hero";
import OSAuditDemo from "@/components/proof/OSAuditDemo";
import OperationalProof from "@/components/proof/OperationalProof";
import BusinessImpact from "@/components/story/BusinessImpact";
import FailureChain from "@/components/story/FailureChain";
import FrotecMethod from "@/components/story/FrotecMethod";
import ManagerOutcome from "@/components/story/ManagerOutcome";
import ProcessStory from "@/components/story/ProcessStory";
import FAQ from "@/components/trust/FAQ";
import FitSection from "@/components/trust/FitSection";
import ScopeAndLimits from "@/components/trust/ScopeAndLimits";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <BusinessImpact />
        <FailureChain />
        <FrotecMethod />
        <ProcessStory />
        <ManagerOutcome />
        <OSAuditDemo />
        <CoverageSection />
        <ScopeAndLimits />
        <FitSection />
        <OperationalProof />
        <MidPageCTA />
        <FAQ />
        <Contato />
      </main>
      <Footer />
    </>
  );
}
