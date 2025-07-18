import React from 'react';
// Import Heroicon
import { CheckCircleIcon } from '@heroicons/react/24/solid';

// Replace placeholder CheckIcon with Heroicon
const CheckIcon = () => (
  <CheckCircleIcon className="w-7 h-7 text-green-500 mr-3 flex-shrink-0 relative top-0.5" />
);

export const BenefitsSection: React.FC = () => {
  const benefits = [
    { title: 'Reduce Electric Bills', description: 'Lock in lower energy costs and save significantly over time.' },
    { title: 'Increase Home Value', description: "Solar installations can significantly boost your property's market value." },
    { title: 'Help the Environment', description: 'Reduce your carbon footprint with clean, renewable energy.' },
    { title: 'Energy Independence', description: 'Gain more control over your energy supply and costs.' },
  ];

  return (
    // Assuming HowItWorks was white, alternate background
    <section className="bg-gray-50 py-20 md:py-28">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Text Column */}
          <div className="md:col-span-7 lg:col-span-6 order-2 md:order-1">
            <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-8 text-gray-800">
              Unlock the Benefits of Going Solar
            </h2>
            <ul className="space-y-5 text-lg text-gray-700 font-sans">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckIcon />
                  <div>
                    <strong className="font-semibold">{benefit.title}:</strong>
                    <span className="text-gray-600 ml-1">{benefit.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Image Column */}
          <div className="md:col-span-5 lg:col-span-6 order-1 md:order-2">
            <img 
              src="/images/solar_house.png"
              alt="Modern suburban house with solar panels installed on the roof under a blue sky with clouds"
              className="rounded-lg shadow-xl w-full h-auto object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}; 