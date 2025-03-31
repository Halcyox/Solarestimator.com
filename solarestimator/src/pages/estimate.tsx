import React from 'react';
import { Box, Container } from '@mui/material';
import EstimatorWizard from '../components/EstimatorWizard/EstimatorWizard';

const EstimatePage: React.FC = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'background.default',
      py: { xs: 2, md: 4 }
    }}>
      <Container maxWidth="md">
        <EstimatorWizard />
      </Container>
    </Box>
  );
};

export default EstimatePage;
