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
  
  const [addressError, setAddressError] = useState<string | null>(null);

  // Handler for AddressInput component
  const handleAddressSelect = useCallback((selectedAddress: string | null) => {
    setCurrentAddress(selectedAddress || '');
    setIsAddressValid(!!selectedAddress);
    if (selectedAddress) {
      setAddressError(null); // Clear error when valid address selected
      updateData({ address: selectedAddress }); // Update data immediately on valid selection
    } else {
      updateData({ address: '' }); // Clear address if selection is cleared
    }
  }, [updateData]);

  const handleNext = () => {
    setAddressError(null);

    if (!currentAddress || !isAddressValid) {
      setAddressError('Please select a valid address from the suggestions.');
      return; // Stop if address is not valid
    }

    // Address is already updated via handleAddressSelect, just proceed
    nextStep(); 
  };

  // Determine if Next button should be enabled
  const canProceed = isAddressValid && !!currentAddress;

  return (
    <StepContainer title="Step 1: Location">
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
