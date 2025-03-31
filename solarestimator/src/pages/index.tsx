// import React, { useState } from 'react';
// import { AddressInput } from '../components/AddressInput';
// import SolarEstimator from '../components/SolarEstimator';
// import { QuoteRequestForm } from '../components/QuoteRequestForm';

// export default function Home() {
//   const [userInput, setUserInput] = useState<{ address: string; bill: number } | null>(null);
//   const [showQuoteForm, setShowQuoteForm] = useState(false);

//   const handleInputSubmit = (inputData: { address: string; bill: number }) => {
//     setUserInput(inputData); // Now receiving both address and bill as an object
//     setShowQuoteForm(true);
//   };

//   const handleQuoteRequest = (email: string) => {
//     console.log('Quote requested by:', email);
//     // Handle lead generation logic here
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 animate-fadeIn">
//       <h1 className="text-3xl sm:text-4xl font-bold text-center my-6 text-accent-color animate-slideDown">
//         Welcome to SolarEstimator.com
//       </h1>
//       <p className="text-lg sm:text-xl text-center mb-4 text-foreground-color animate-slideUp">
//         Harness the power of the sun to save money!
//       </p>
//       <p className="text-base sm:text-lg text-center mb-8 text-foreground-color animate-slideUp">
//         Discover your solar potential in seconds.
//       </p>

//       <div className="max-w-md mx-auto">
//         <AddressInput onSubmit={handleInputSubmit} />
//         {userInput && <SolarEstimator address={userInput.address} bill={userInput.bill} />}
//         {showQuoteForm && <QuoteRequestForm onQuoteRequest={handleQuoteRequest} />}
//       </div>
//     </div>
//   );
// }

// pages/index.tsx
import React from 'react';
import Wizard from '../components/Wizard';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl sm:text-4xl font-bold text-center my-6 text-accent-color animate-slideDown">
        Welcome to SolarEstimator.com
      </h1>
      <p className="text-lg sm:text-xl text-center mb-4 text-foreground-color animate-slideUp">
        Harness the power of the sun to save money!
      </p>
      <p className="text-base sm:text-lg text-center mb-8 text-foreground-color animate-slideUp">
        Discover your solar potential in seconds.
      </p>

      <div className="max-w-2xl mx-auto">
        <Wizard />
      </div>
    </div>
  );
}