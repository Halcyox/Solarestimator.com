// pages/index.tsx
import React from 'react';
import Head from 'next/head';
// Removed direct imports like Link, useRouter, AddressInput as they are handled in section components

// Import the new section components
import { HeroSection } from '../components/landing/HeroSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { BenefitsSection } from '../components/landing/BenefitsSection';
import { TrustSection } from '../components/landing/TrustSection';
import { CtaSection } from '../components/landing/CtaSection';
import Footer from '../components/Footer';

// Removed textShadowStyle as it's handled within HeroSection

const Home: React.FC = () => {
  // Removed router and handleAddressSelected logic as it's moved to HeroSection

  return (
    <>
      <Head>
        <title>SolarEstimator.com - AI-Powered Solar Savings Estimates</title>
        <meta name="description" content="Get an instant, AI-powered solar estimate for your home. See how much you can save on your electricity bill by switching to solar energy." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="animate-fadeIn">
        <HeroSection />
        <BenefitsSection />
        <HowItWorksSection />
        <TrustSection />
        <CtaSection />
      </div>
      <Footer />
    </>
  );
}

export default Home;