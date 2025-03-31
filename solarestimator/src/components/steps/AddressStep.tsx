// steps/AddressStep.tsx
import React, { useState, useCallback } from 'react';
import { AddressInput } from '../AddressInput';
import { WizardData } from '../Wizard';
import { StepContainer, FormField, TextInput, WizardNavigation } from '../ui';

interface AddressStepProps {
  nextStep: () => void;
  prevStep?: () => void;
  updateData: (newData: Partial<WizardData>) => void;
  data: WizardData;
}

const AddressStep: React.FC<AddressStepProps> = ({ nextStep, prevStep, updateData, data }) => {
  // Local state for this step's inputs
  const [currentAddress, setCurrentAddress] = useState<string>(data.address || '');
  // Keep track if the address came from autocomplete selection
  const [isAddressValid, setIsAddressValid] = useState<boolean>(!!data.address);
  const [currentBill, setCurrentBill] = useState<string>(data.bill > 0 ? String(data.bill) : '');
  
  const [addressError, setAddressError] = useState<string | null>(null);
  const [billError, setBillError] = useState<string | null>(null);

  // Handler for AddressInput component
  const handleAddressSelect = useCallback((selectedAddress: string | null) => {
    setCurrentAddress(selectedAddress || '');
    setIsAddressValid(!!selectedAddress);
    if (selectedAddress) {
      setAddressError(null); // Clear error when valid address selected
    }
  }, []);

  const handleBillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and optionally a decimal point
    if (/^\d*\.?\d*$/.test(value)) { 
      setCurrentBill(value);
      setBillError(null); // Clear error on valid change
    }
  };

  const handleNext = () => {
    let isValid = true;
    setAddressError(null);
    setBillError(null);

    if (!currentAddress || !isAddressValid) {
      setAddressError('Please select a valid address from the suggestions.');
      isValid = false;
    }

    const billNumber = Number(currentBill);
    if (!currentBill || isNaN(billNumber) || billNumber <= 0) {
      setBillError('Please enter a valid monthly electric bill amount.');
      isValid = false;
    }

    if (isValid) {
      updateData({ address: currentAddress, bill: billNumber });
      nextStep();
    }
  };

  // Determine if Next button should be enabled
  const canProceed = isAddressValid && !!currentBill && Number(currentBill) > 0;

  return (
    <StepContainer title="Step 1: Location & Bill">
      <div className="w-full">
        <FormField 
          id="address-input"
          label="Property Address"
          error={addressError}
        >
          <AddressInput 
            initialAddress={currentAddress} 
            onAddressSelect={handleAddressSelect}
          />
        </FormField>

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

export default AddressStep;
