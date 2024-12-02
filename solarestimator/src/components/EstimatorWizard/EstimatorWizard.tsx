import React, { useState } from 'react';
import { 
  Box, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Typography,
  Container,
  useTheme,
  useMediaQuery,
  LinearProgress
} from '@mui/material';
import BasicInfoStep from './steps/BasicInfoStep';
import AddressStep from './steps/AddressStep';
import PropertyDetailsStep from './steps/PropertyDetailsStep';
import BillInfoStep from './steps/BillInfoStep';
import ResultsStep from './steps/ResultsStep';

interface WizardData {
  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Address
  address: string;
  city: string;
  state: string;
  zipCode: string;
  monthlyBill: number | null;
  
  // Property Details
  propertyType: 'single-family' | 'multi-family' | 'commercial' | '';
  ownership: 'own' | 'rent' | '';
  roofAge: number | null;
  
  // Bill Info
  utilityProvider: string;
}

const initialData: WizardData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  monthlyBill: null,
  propertyType: '',
  ownership: '',
  roofAge: null,
  utilityProvider: ''
};

const steps = [
  'Basic Info',
  'Address',
  'Property Details',
  'Bill Info',
  'Results'
];

const EstimatorWizard: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<WizardData>(initialData);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const updateFormData = (updates: Partial<WizardData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const isStepValid = () => {
    console.log('Checking step validity:', activeStep, formData);
    switch (activeStep) {
      case 0: // Basic Info
        return Boolean(formData.firstName && 
               formData.lastName && 
               formData.email);
      case 1: // Address
        return Boolean(formData.address && 
               formData.city && 
               formData.state && 
               formData.monthlyBill !== null);
      case 2: // Property Details
        return Boolean(formData.propertyType && 
               formData.ownership && 
               formData.roofAge !== null);
      case 3: // Bill Info
        return Boolean(formData.utilityProvider);
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <BasicInfoStep
            data={formData}
            onUpdate={updateFormData}
          />
        );
      case 1:
        return (
          <AddressStep
            data={formData}
            onUpdate={updateFormData}
          />
        );
      case 2:
        return (
          <PropertyDetailsStep
            data={formData}
            onUpdate={updateFormData}
          />
        );
      case 3:
        return (
          <BillInfoStep
            data={formData}
            onUpdate={updateFormData}
          />
        );
      case 4:
        return (
          <ResultsStep
            data={formData}
          />
        );
      default:
        return null;
    }
  };

  const progress = (activeStep / (steps.length - 1)) * 100;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ width: '100%' }}>
        {/* Progress bar for mobile */}
        {isMobile && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
              Step {activeStep + 1} of {steps.length}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 10, 
                borderRadius: 5,
                backgroundColor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  borderRadius: 5,
                }
              }}
            />
          </Box>
        )}
        
        {/* Stepper for desktop */}
        {!isMobile && (
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        {/* Step content */}
        <Box sx={{ mt: 4, mb: 4 }}>
          {renderStep()}
        </Box>

        {/* Navigation buttons */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          position: 'sticky',
          bottom: 0,
          backgroundColor: 'background.paper',
          pt: 2,
          pb: 2
        }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{ mr: 1 }}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isStepValid()}
          >
            {activeStep === steps.length - 1 ? 'Get Quote' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EstimatorWizard;
