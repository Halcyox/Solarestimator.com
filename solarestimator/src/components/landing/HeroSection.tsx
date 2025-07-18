import React, { useRef } from 'react';
import { useRouter } from 'next/router';
import { AddressInput } from '../AddressInput';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import { SolarChatbot } from '../chatbot/SolarChatbot';

// Keep text shadow for contrast on gradient
const textShadowStyle = {
  textShadow: '1px 1px 4px rgba(0, 0, 0, 0.4)',
};

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const estimateFormRef = useRef<HTMLDivElement>(null);

  const handleStartEstimate = () => {
    estimateFormRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    // Optional: focus the first input field
    const input = estimateFormRef.current?.querySelector('input');
    if (input) {
      setTimeout(() => input.focus(), 500); // Delay to allow for scroll
    }
  };

  const handleAddressSelected = (selectedAddress: string | null) => {
    if (selectedAddress) {
      router.push(`/start-estimate?address=${encodeURIComponent(selectedAddress)}`);
    } else {
      console.log('Address selection cleared or invalid.');
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white pt-28 md:pt-40 pb-16 md:pb-24 overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="md:grid md:grid-cols-12 md:gap-12 md:items-center">
          {/* Text Content (Left on Medium screens and up) */}
          <div className="md:col-span-7 lg:col-span-6 text-center md:text-left mb-12 md:mb-0">
            <h1 
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight"
              style={textShadowStyle}
            >
              Unlock Your Solar Savings Instantly
            </h1>
            <p 
              className="font-sans text-lg md:text-xl mb-8 max-w-2xl mx-auto md:mx-0"
              style={textShadowStyle}
            >
              Enter your address for a personalized, <strong className="font-semibold">AI-powered</strong> solar estimate in under 60 seconds. See your potential savings.
            </p>
          </div>

          {/* Form / Input & Chatbot */}
          <div className="md:col-span-5 lg:col-span-6">
            <div className="bg-white/95 backdrop-blur-md rounded-lg p-6 md:p-8 shadow-xl border border-white/30 max-w-md mx-auto relative z-20">
              <h3 className="font-heading text-xl font-semibold mb-4 text-center text-gray-800">Get Your Free Estimate</h3>
              <AddressInput onChange={handleAddressSelected} />
              <p className="text-xs text-gray-600 mt-4 text-center flex items-center justify-center">
                <LockClosedIcon className="w-3 h-3 inline mr-1.5 text-gray-500" />
                <span className="relative">Secure & Confidential. Used only for solar analysis.</span>
              </p>
            </div>

            <div className="mt-8">
               <SolarChatbot onStartEstimate={handleStartEstimate} />
            </div>
          </div>
        </div>
      </div>
       {/* Optional: Decorative element */}
       {/* <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/10 to-transparent"></div> */}
       <div ref={estimateFormRef} />
    </section>
  );
}; 