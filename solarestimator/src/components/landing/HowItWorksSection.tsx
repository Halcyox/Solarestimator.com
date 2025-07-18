import React from 'react';
// Import necessary Heroicons
import { MapPinIcon, CurrencyDollarIcon, CalculatorIcon } from '@heroicons/react/24/outline';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      title: 'Enter Address',
      description: "Provide your location so our AI can analyze your specific roof geometry and sun exposure using satellite data.",
      icon: MapPinIcon
    },
    {
      title: 'Provide Energy Use',
      description: 'Enter your average monthly electric bill for accurate, personalized savings calculations.',
      icon: CurrencyDollarIcon
    },
    {
      title: 'Get Instant Estimate',
      description: 'Our AI instantly calculates projected savings, optimal system size, and your positive environmental impact.',
      icon: CalculatorIcon
    }
  ];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl md:text-4xl font-semibold text-center mb-16 md:mb-20 text-gray-800">
          Your <span className="text-orange-500">AI-Powered</span> Solar Estimate in 3 Simple Steps
        </h2>
        {/* Revised Steps Layout - Vertical Flow */}
        <div className="max-w-3xl mx-auto space-y-12 md:space-y-16">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="flex items-start space-x-6 group">
                {/* Step Number & Icon */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center border border-orange-100 group-hover:border-orange-200 transition-colors duration-300">
                    <IconComponent className="w-6 h-6 text-orange-600" />
                  </div>
                   {/* Vertical Connector Line (Optional) - uncomment if desired 
                   {index < steps.length - 1 && (
                     <div className="mt-2 w-px h-16 bg-gray-200 group-hover:bg-orange-200 transition-colors duration-300"></div>
                   )}
                   */} 
                </div>
                {/* Step Content */}
                <div>
                  <h3 className="font-heading text-xl md:text-2xl font-semibold mb-2 text-gray-800">
                    <span className="text-orange-500 mr-2">{index + 1}.</span>{step.title}
                  </h3>
                  <p className="font-sans text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}; 