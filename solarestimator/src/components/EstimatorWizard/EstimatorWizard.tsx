import React, { useState } from 'react';
import { 
  Box, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Typography,
  useTheme,
  useMediaQuery,
  LinearProgress
} from '@mui/material';
import BasicInfoStep from './steps/BasicInfoStep';
import AddressStep from './steps/AddressStep';
import PropertyDetailsStep from './steps/PropertyDetailsStep';
import BillInfoStep from './steps/BillInfoStep';
import { FinancingOption } from '../Wizard'; // Assuming this type is in Wizard.tsx

export interface WizardData {
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
  
  // Bill Info
  bill: number | null;
  utilityProvider: string;
  
  // Property Details
  propertyType: 'single-family' | 'multi-family' | 'commercial' | '';
  ownership: 'own' | 'rent' | '';
  roofAge: number | null;

  // System & Financing
  numberOfPanels: number;
  shadingFactor: number;
  tiltFactor: number;
  financingOption: FinancingOption;
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
  bill: null, // Default value
  utilityProvider: '',
  propertyType: '',
  ownership: '',
  roofAge: null,
  numberOfPanels: 20, // Default value
  shadingFactor: 0.85, // Default value
  tiltFactor: 0.9, // Default value
  financingOption: 'cash', // Default value
};

const steps = [
  'Basic Info',
  'Address',
  'Property Details',
  'Bill Info',
  // 'Results' step is now handled by the parent page
];

interface EstimatorWizardProps {
  onComplete: (data: WizardData) => void;
}

const EstimatorWizard: React.FC<EstimatorWizardProps> = ({ onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<WizardData>(initialData);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      if (isStepValid()) {
        onComplete(formData);
      }
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
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
               formData.bill !== null);
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
            data={{
              propertyType: formData.propertyType,
              ownership: formData.ownership,
              roofAge: formData.roofAge
            }}
            onUpdate={updateFormData}
          />
        );
      case 3:
        return (
          <BillInfoStep
            data={{
              bill: formData.bill,
              utilityProvider: formData.utilityProvider
            }}
            onUpdate={updateFormData}
          />
        );
      case 4:
        // This case should no longer be reached as the wizard completes on step 3
        return null; 
      default:
        return null;
    }
  };

  const progress = (activeStep / (steps.length - 1)) * 100;

  return (
    <div style={{ width: '100%' }}>
      {/* Stepper and Progress Bar */}
      <Box sx={{ width: '100%', mb: 4 }}>
        {isMobile ? (
          <Box>
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
        ) : (
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}
      </Box>

      {/* Step Content */}
      <Box sx={{ my: 4 }}>
        {/* For wizard steps, constrain width for better form readability */}
        {activeStep < 4 ? (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            {renderStep()}
          </div>
        ) : (
          // For results step, allow full width
          renderStep()
        )}
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: activeStep > 0 ? 'space-between' : 'flex-end',
        pt: 2
      }}>
        {activeStep > 0 && (
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!isStepValid()}
        >
          {activeStep === steps.length - 1 ? 'Get Your Estimate' : 'Next'}
        </Button>
      </Box>
    </div>
  );
};

export default EstimatorWizard;