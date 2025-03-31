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

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const handleGetQuote = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          address: `${data.address}, ${data.city}, ${data.state} ${data.zipCode}`,
          estimatedSavings: estimatedSavings,
          propertyType: data.propertyType,
          ownership: data.ownership,
          roofAge: data.roofAge,
          monthlyBill: data.monthlyBill,
          utilityProvider: data.utilityProvider
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      setSubmitSuccess(true);
      // Don't reset any other state - keep showing the results
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        {!submitSuccess ? (
          <>
            <Typography variant="body1" paragraph>
              Ready to start saving with solar? Get your detailed proposal now!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleGetQuote}
              disabled={isSubmitting}
              sx={{ mt: 2 }}
            >
              {isSubmitting ? 'Submitting...' : 'Get Your Free Quote'}
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body1" paragraph sx={{ color: 'success.main', fontWeight: 'bold' }}>
              Thank you! We've received your request and will contact you soon.
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
          </>
        )}
        
        {submitError && (
          <Typography color="error" sx={{ mt: 2 }}>
            {submitError}
          </Typography>
        )}
      </Box>

      <Box mt={4} textAlign="center">
      </Box>
    </Box>
  );
}

export default ResultsStep;
