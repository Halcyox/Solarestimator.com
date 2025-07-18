import React, { useState, useEffect } from 'react';
import { WizardData } from '../EstimatorWizard';
import SolarEstimator from '../../SolarEstimator';
import { StepContainer, WizardNavigation } from '../../ui';
import { fetchSolarData, FetchedSolarData } from '../../apiHelper';
import '../../../styles/results-step.css';

interface ResultsStepProps {
  prevStep: () => void;
  data: WizardData;
  updateData: (newData: Partial<WizardData>) => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ prevStep, data, updateData }) => {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [solarData, setSolarData] = useState<FetchedSolarData | null>(null);

  useEffect(() => {
    const getSolarData = async () => {
      if (!data.address) {
        setError("An address is required to fetch solar data.");
        setIsFetching(false);
        return;
      }
      try {
        setIsFetching(true);
        const result = await fetchSolarData(data.address);
        setSolarData(result);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setIsFetching(false);
      }
    };
    getSolarData();
  }, [data.address]);

  if (isFetching) {
    return (
      <StepContainer title="Analyzing Your Property...">
        <div className="results-step-loading">
          <div className="results-step-loading-spinner">
            <div className="results-step-loading-dot"></div>
          </div>
          <p className="results-step-loading-text">
            Contacting Google&apos;s Project Sunroof for solar insights...
          </p>
        </div>
      </StepContainer>
    );
  }

  if (error) {
    return (
      <StepContainer title="Analysis Error">
        <div className="results-step-error">
          <p className="results-step-error-message">{error}</p>
          <WizardNavigation onPrev={prevStep} />
        </div>
      </StepContainer>
    );
  }

  if (!solarData) {
    return (
      <StepContainer title="No Solar Data Available">
        <div className="results-step-empty">
          <p className="results-step-empty-message">
            Unfortunately, we couldn&apos;t retrieve solar data for the provided address.
            This can happen for new constructions or certain multi-family homes.
          </p>
          <WizardNavigation onPrev={prevStep} />
        </div>
      </StepContainer>
    );
  }

  // Combine fetched solar data with wizard data
  const finalData = { ...data, solarData };

  return (
    <div className="results-step">
      <SolarEstimator
        {...finalData}
        financingOption={finalData.financingOption || 'cash'}
        onFinancingOptionChange={(option) => updateData({ financingOption: option })}
        bill={finalData.bill || 0}
        numberOfPanels={finalData.numberOfPanels || 20}
        shadingFactor={finalData.shadingFactor || 0.85}
        tiltFactor={finalData.tiltFactor || 0.9}
      />
      <div className="results-step-back-button">
        <button onClick={prevStep} className="btn btn-secondary text-gray-700 hover:bg-gray-100">
          ‹ Back to Edit Information
        </button>
      </div>
    </div>
  );
};

export default ResultsStep;
