// steps/FinancingOptionsStep.tsx
import React from 'react';
import { WizardData, FinancingOption } from '../Wizard';
import { StepContainer, FormField, WizardNavigation } from '../ui';

interface FinancingOptionsStepProps {
  nextStep: () => void;
  prevStep?: () => void;
  updateData: (newData: Partial<WizardData>) => void;
  data: WizardData;
}

const FinancingOptionsStep: React.FC<FinancingOptionsStepProps> = ({ nextStep, prevStep, updateData, data }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateData({ financingOption: e.target.value as FinancingOption });
  };

  return (
    <StepContainer title="Step 4: Financing Option">
      <div className="w-full">
        <FormField
          id="financing-select"
          label="How will you pay for the system?"
          error={null}
        >
          <select 
            id="financing-select"
            name="financingOption" 
            value={data.financingOption} 
            onChange={handleChange}
            className="select select-bordered w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-colors"
          >
            <option value="cash">Upfront Cash</option>
            <option value="loan">Loan</option>
            <option value="lease">Lease / PPA</option>
          </select>
        </FormField>
        
        <WizardNavigation
          onNext={nextStep}
          onPrev={prevStep}
          canProceed={true}
        />
      </div>
    </StepContainer>
  );
};

export default FinancingOptionsStep;