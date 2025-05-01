// pages/index.tsx
import React from 'react';
// Removed direct imports like Link, useRouter, AddressInput as they are handled in section components

// Import the new section components
import { HeroSection } from '../components/landing/HeroSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { BenefitsSection } from '../components/landing/BenefitsSection';
import { TrustSection } from '../components/landing/TrustSection';
import { CtaSection } from '../components/landing/CtaSection';

// Removed textShadowStyle as it's handled within HeroSection

export default function Home() {
  // Removed router and handleAddressSelected logic as it's moved to HeroSection

  return (
    // Simplified main container
    <div className="animate-fadeIn">
      <HeroSection />
      <HowItWorksSection />
      <BenefitsSection />
      <TrustSection />
      <CtaSection />
    </div>
  );
}