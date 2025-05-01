import React from 'react';
import { useRouter } from 'next/router';
import Wizard from '../components/Wizard';
import { Container } from '@mui/material'; // Assuming you might want layout consistency

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
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
       <Wizard initialAddress={initialAddress} />
    </Container>
  );
};

export default StartEstimatePage; 