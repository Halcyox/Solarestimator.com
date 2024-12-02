import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button
} from '@mui/material';
import {
  AttachMoney,
  WbSunny,
  Park,
  LocalOffer
} from '@mui/icons-material';

interface ResultsStepProps {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    propertyType: string;
    ownership: string;
    roofAge: number | null;
    monthlyBill: number | null;
    utilityProvider: string;
  };
}

function ResultsStep({ data }: ResultsStepProps) {
  // These calculations should be replaced with actual calculations based on the user's data
  const estimatedSavings = data.monthlyBill ? data.monthlyBill * 0.7 * 12 * 25 : 0;
  const systemSize = data.monthlyBill ? Math.ceil(data.monthlyBill / 150 * 1.2) : 0;
  const co2Reduction = systemSize * 1.5;
  const treeEquivalent = co2Reduction * 0.0165;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
        Your Solar Savings Estimate
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              bgcolor: 'primary.light',
              color: 'primary.contrastText'
            }}
          >
            <AttachMoney sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              25-Year Savings
            </Typography>
            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
              {formatCurrency(estimatedSavings)}
            </Typography>
            <Typography variant="body2">
              Estimated total savings over system lifetime
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <WbSunny sx={{ fontSize: 40, mb: 2, color: 'warning.main' }} />
            <Typography variant="h6" gutterBottom>
              Recommended System
            </Typography>
            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
              {systemSize} kW
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Based on your energy usage
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <Park sx={{ fontSize: 40, mb: 2, color: 'success.main' }} />
            <Typography variant="h6" gutterBottom>
              Environmental Impact
            </Typography>
            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
              {formatNumber(co2Reduction)} tons
            </Typography>
            <Typography variant="body2" color="text.secondary">
              CO₂ reduction equivalent to planting {Math.round(treeEquivalent)} trees
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              bgcolor: 'success.light',
              color: 'success.contrastText'
            }}
          >
            <LocalOffer sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Available Incentives
            </Typography>
            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
              30%
            </Typography>
            <Typography variant="body2">
              Federal Tax Credit
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body1" paragraph>
          Ready to start saving with solar? Our experts will contact you soon with a detailed proposal.
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          We've sent a copy of this estimate to {data.email}
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
          onClick={() => {
            console.log('Schedule consultation clicked');
          }}
        >
          Schedule Free Consultation
        </Button>
      </Box>
    </Box>
  );
}

export default ResultsStep;
