import React from 'react';
import Link from 'next/link';

// Replace with actual icon or remove if not installed/used
import { ArrowRightIcon } from '@heroicons/react/24/solid'; 

export const CtaSection: React.FC = () => {
  return (
    <section className="bg-white py-20 md:py-28 border-t border-gray-100">
      <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-6 text-gray-800">Ready to Take Control of Your Energy Costs?</h2>
        <p className="font-sans text-lg md:text-xl mb-10 text-gray-600 max-w-2xl mx-auto">
          Start by entering your address in the section above to get your instant estimate, or learn more about the benefits of solar energy.
        </p>
        {/* Link to About or Benefits Section */}
        <Link 
          href="/about"
          className="inline-flex items-center bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-10 py-4 rounded-md hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 ease-in-out transform hover:scale-105 font-semibold text-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-opacity-70"
        >
          Learn More About Solar
          {/* Render icon conditionally if needed/available */}
          <ArrowRightIcon className="h-5 w-5 ml-3" />
        </Link>
      </div>
    </section>
  );
}; 