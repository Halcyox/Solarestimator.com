import React from 'react';
import { useRouter } from 'next/router';
import Wizard from '../components/Wizard';

const StartEstimatePage: React.FC = () => {
  const router = useRouter();
  const { address } = router.query; // Get address from query params

  // Decode the address if it exists
  const initialAddress = typeof address === 'string' ? decodeURIComponent(address) : undefined;

  // Add a check to wait for router readiness, otherwise address might be undefined initially
  if (!router.isReady) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return (
    <div style={{ width: '100%', padding: '1rem' }}>
       <Wizard initialAddress={initialAddress} />
    </div>
  );
};

export default StartEstimatePage; 