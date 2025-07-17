// steps/ResultsStep.tsx
import React from 'react';
import { WizardData } from '../Wizard';
import SolarEstimator from '../SolarEstimator';
import { StepContainer, WizardNavigation } from '../ui';

interface ResultsStepProps {
  prevStep?: () => void;
  data: WizardData;
  updateData: (newData: Partial<WizardData>) => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ prevStep, data, updateData }) => {
  if (data.isFetchingSolarData) {
    return (
      <StepContainer title="Step 5: Results">
        <div className="w-full text-center">
          <div className="animate-pulse flex justify-center my-8">
            <div className="h-10 w-10 bg-primary-200 rounded-full"></div>
          </div>
          <p>Loading solar data...</p>
        </div>
      </StepContainer>
    );
  }

  if (data.fetchSolarError) {
    return (
      <StepContainer title="Step 5: Results">
        <div className="w-full">
          <div className="text-red-600 mb-6">
            Error fetching solar data: {data.fetchSolarError}
          </div>
          <WizardNavigation onPrev={prevStep} />
        </div>
      </StepContainer>
    );
  }

  if (!data.solarData) {
    return (
      <StepContainer title="Step 5: Results">
        <div className="w-full">
          <div className="mb-6">
            No solar data could be retrieved for the provided address.
          </div>
          <WizardNavigation onPrev={prevStep} />
        </div>
      </StepContainer>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeIn">
      <SolarEstimator
        solarData={data.solarData}
        totalEnergyProductionPerYearKwh={data.totalEnergyProductionPerYearKwh}
        bill={data.bill}
        numberOfPanels={data.numberOfPanels}
        shadingFactor={data.shadingFactor}
        tiltFactor={data.tiltFactor}
        financingOption={data.financingOption}
        onFinancingOptionChange={(option) => updateData({ financingOption: option })}
      />
      <div className="mt-6 flex justify-start">
        {prevStep && (
          <button onClick={prevStep} className="btn btn-secondary">
            Back to Wizard
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultsStep;