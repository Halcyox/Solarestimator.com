import React from 'react';

// Refined Testimonial Card Component
const TestimonialCard = ({ quote, author, location }: { quote: string, author: string, location: string }) => (
  // Use background of section for card, add border and subtle shadow
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200/80 text-center md:text-left">
    <p className="font-sans text-gray-600 italic mb-4 text-base leading-relaxed">"{quote}"</p>
    <p className="font-sans font-semibold text-gray-800">- {author}</p>
    <p className="font-sans text-sm text-gray-500">{location}</p>
  </div>
);

// Refined Logo Component
const PartnerLogo = ({ src, alt }: { src: string, alt: string }) => (
  // Keep subtle hover effect
  <div className="flex justify-center items-center h-16 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition duration-300 px-4">
    <img src={src} alt={alt} className="max-h-9 max-w-full" /> {/* Slightly smaller max-h */}
  </div>
);

export const TrustSection: React.FC = () => {
  // Replace with real testimonials
  const testimonials = [
    { quote: "Switching to solar with their help was seamless! Our bills are dramatically lower.", author: "Jane D.", location: "San Diego, CA" },
    { quote: "The estimate was accurate, and the process was much easier than I expected. Highly recommend!", author: "Mark S.", location: "Austin, TX" },
    { quote: "Finally, energy independence! Seeing the savings and environmental impact is fantastic.", author: "Emily R.", location: "Orlando, FL" },
  ];

  // Replace with real partner/certification logos
  const logos = [
    { src: "/images/logos/placeholder-logo-1.png", alt: "Placeholder Partner Logo 1" },
    { src: "/images/logos/placeholder-logo-2.png", alt: "NABCEP Certified Placeholder" }, // Example
    { src: "/images/logos/placeholder-logo-3.png", alt: "Placeholder Award Logo" },
    { src: "/images/logos/placeholder-logo-4.png", alt: "Placeholder Better Business Bureau" },
  ];

  return (
    // Keep background color
    <section className="bg-gray-50 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl md:text-4xl font-semibold text-center mb-12 md:mb-16 text-gray-800">
          Trusted by Homeowners Like You
        </h2>
        
        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 md:mb-20">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>

        {/* Logos/Partners Section */}
        <div className="border-t border-gray-200 pt-12 md:pt-16">
           <h3 className="font-heading text-center text-lg font-medium text-gray-500 tracking-wider uppercase mb-10">Certifications & Partners</h3>
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-4 items-center">
             {logos.map((logo, index) => (
               <PartnerLogo key={index} {...logo} />
             ))}
           </div>
        </div>

      </div>
    </section>
  );
}; 