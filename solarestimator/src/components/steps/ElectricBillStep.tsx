// steps/ElectricBillStep.tsx
import React, { useState } from 'react';
import { WizardData } from '../Wizard';
import { StepContainer, FormField, TextInput, WizardNavigation } from '../ui';

interface ElectricBillStepProps {
  nextStep: () => void;
  prevStep?: () => void;
  updateData: (newData: Partial<WizardData>) => void;
  data: WizardData;
}

const ElectricBillStep: React.FC<ElectricBillStepProps> = ({ nextStep, prevStep, updateData, data }) => {
  // Use string state for better control over input
  const [currentBill, setCurrentBill] = useState<string>(data.bill > 0 ? String(data.bill) : '');
  const [billError, setBillError] = useState<string | null>(null);

  const handleBillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and optionally a decimal point
    if (/^\d*\.?\d*$/.test(value)) { 
      setCurrentBill(value);
      // Basic validation: check if number is positive
      const billNumber = Number(value);
      if (value && (isNaN(billNumber) || billNumber <= 0)) {
        setBillError('Please enter a positive bill amount.');
      } else {
        setBillError(null); // Clear error on valid change
      }
    } else if (value === '') {
        // Allow clearing the input
        setCurrentBill('');
        setBillError('Please enter your average monthly bill.'); // Prompt if cleared
    }
  };

  const handleNext = () => {
    const billNumber = Number(currentBill);
    if (!currentBill || isNaN(billNumber) || billNumber <= 0) {
      setBillError('Please enter a valid positive monthly bill amount.');
      return; // Prevent proceeding
    }
    
    setBillError(null); // Ensure error is clear
    updateData({ bill: billNumber });
    nextStep();
  };

  // Determine if Next button should be enabled
  const canProceed = !!currentBill && Number(currentBill) > 0 && !billError;

  return (
    <StepContainer title="Step 2: Average Monthly Bill">
      <div className="w-full">
        <FormField
          id="bill-input"
          label="Average Monthly Electric Bill ($)"
          error={billError}
        >
          <TextInput 
            id="bill-input"
            type="text"
            inputMode="decimal"
            placeholder="e.g., 150"
            value={currentBill}
            onChange={handleBillChange}
            hasError={!!billError}
          />
        </FormField>

        <WizardNavigation
          onNext={handleNext}
          onPrev={prevStep}
          canProceed={canProceed}
        />
      </div>
    </StepContainer>
  );
};

export default ElectricBillStep;