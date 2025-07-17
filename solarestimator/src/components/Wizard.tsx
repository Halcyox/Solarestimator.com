// Wizard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import AddressStep from './steps/AddressStep';
import ElectricBillStep from './steps/ElectricBillStep';
import SystemParametersStep from './steps/SystemParametersStep';
import FinancingOptionsStep from './steps/FinancingOptionsStep';
import ResultsStep from './steps/ResultsStep';
import { fetchSolarData, FetchedSolarData } from './apiHelper';
import { Wrapper, Status } from "@googlemaps/react-wrapper";

export type FinancingOption = 'cash' | 'loan' | 'lease';

export interface WizardData {
  address: string;
  bill: number;
  numberOfPanels: number;
  shadingFactor: number;
  tiltFactor: number;
  financingOption: FinancingOption;
  solarData: FetchedSolarData | null;
  totalEnergyProductionPerYearKwh: number | null;
  isFetchingSolarData?: boolean;
  fetchSolarError?: string | null;
}

// Define WizardProps interface
interface WizardProps {
  initialAddress?: string; // Add optional initialAddress prop
}

// Define StepProps type WITHOUT mapsApiStatus
interface StepProps {
    nextStep: () => void;
    prevStep?: () => void;
    updateData: (newData: Partial<WizardData>) => void;
    data: WizardData;
}

// Define the render function
const renderWizardStep = (status: Status, currentStep: number, stepProps: StepProps): React.ReactElement => {
    // Render loading/error directly, DO NOT render steps yet
    if (status === Status.LOADING) {
        return <div className="text-center p-4">Loading Google Maps...</div>;
    }
    if (status === Status.FAILURE) {
        console.error("Google Maps Wrapper reported FAILURE status.");
        return <div className="text-center p-4 text-red-600">Error loading Google Maps. Please check API key and internet connection.</div>;
    }
    
    // ---- If Status is SUCCESS ----
    // Render the correct step based on currentStep from Wizard state
    // No need to pass status down anymore
    switch (currentStep) {
        case 1: 
            // For first step, don't pass prevStep to prevent navigation to invalid step
            const firstStepProps = { ...stepProps, prevStep: undefined };
            return <AddressStep {...firstStepProps} />;
        case 2: return <ElectricBillStep {...stepProps} />;
        case 3: return <SystemParametersStep {...stepProps} />;
        case 4: return <FinancingOptionsStep {...stepProps} />;
        case 5: return <ResultsStep {...stepProps} updateData={stepProps.updateData} />;
        default: return <div>Invalid Step</div>;
    }
};

// Update Wizard component to accept props
const Wizard: React.FC<WizardProps> = ({ initialAddress }) => {
  const [step, setStep] = useState<number>(1);
  const [data, setData] = useState<WizardData>({
    address: initialAddress || '', // Use initialAddress if provided
    bill: 0,
    numberOfPanels: 20,
    shadingFactor: 90,
    tiltFactor: 90,
    financingOption: 'cash',
    solarData: null,
    totalEnergyProductionPerYearKwh: null,
    isFetchingSolarData: false,
    fetchSolarError: null,
  });

  // Move step to 2 if initial address is provided and valid
  // (Consider adding more robust validation if needed)
  useEffect(() => {
    if (initialAddress && step === 1) {
      // Potentially validate address further here before moving step
      setStep(2); // Move to the next step (Electric Bill)
    }
    // Dependency array includes initialAddress and step
  }, [initialAddress, step]); 

  const nextStep = useCallback(() => setStep((prev) => prev + 1), []);
  const prevStep = useCallback(() => setStep((prev) => prev - 1), []);

  const updateData = useCallback((newData: Partial<WizardData>) => {
    setData((prevData) => ({ ...prevData, ...newData }));
  }, []);

  useEffect(() => {
    if (data.address && !data.solarData && step >= 2) {
      const fetchData = async () => {
        updateData({ isFetchingSolarData: true, fetchSolarError: null });
        try {
          console.log(`Wizard: Fetching solar data for ${data.address}`);
          const fetchedSolarData = await fetchSolarData(data.address);

          let calculatedKwh: number | null = null;
          let initialPanelCount = data.numberOfPanels;

          if (fetchedSolarData.maxArrayPanelsCount && fetchedSolarData.maxSunshineHoursPerYear) {
            const solarEfficiency = 0.85;
            const averagePanelOutputKw = 0.3;
            
            const userShadingFactor = (data.shadingFactor || 100) / 100;
            const userTiltFactor = (data.tiltFactor || 100) / 100;
            
            const maxPossibleKwhPerYear = 
              fetchedSolarData.maxArrayPanelsCount * 
              averagePanelOutputKw * 
              fetchedSolarData.maxSunshineHoursPerYear * 
              solarEfficiency;

            calculatedKwh = 
              (data.numberOfPanels / fetchedSolarData.maxArrayPanelsCount) *
              maxPossibleKwhPerYear * 
              userShadingFactor *
              userTiltFactor;

            initialPanelCount = Math.min(data.numberOfPanels || 20, fetchedSolarData.maxArrayPanelsCount);
            if (initialPanelCount !== data.numberOfPanels) {
                 console.warn(`Clamping panel count to API max: ${initialPanelCount}`);
            }

          } else {
            console.warn('Wizard: Missing maxArrayPanelsCount or maxSunshineHoursPerYear in fetched data.');
          }

          updateData({
            solarData: fetchedSolarData,
            totalEnergyProductionPerYearKwh: calculatedKwh,
            numberOfPanels: initialPanelCount,
            isFetchingSolarData: false,
            fetchSolarError: null,
          });

        } catch (error) {
          console.error('Wizard: Error fetching solar data:', error);
          const message = error instanceof Error ? error.message : 'Unknown error fetching solar data';
          updateData({ 
            solarData: null,
            totalEnergyProductionPerYearKwh: null,
            isFetchingSolarData: false,
            fetchSolarError: message,
          });
        }
      };

      fetchData();
    } else if (!data.address && data.solarData) {
      updateData({ solarData: null, totalEnergyProductionPerYearKwh: null, fetchSolarError: null });
    }
  }, [data.address, data.numberOfPanels, data.shadingFactor, data.tiltFactor, step, updateData]);

  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_GEOCODE_API_KEY;

  if (!mapsApiKey) {
     return <div className="text-center p-4 text-red-600">Configuration Error: Google Maps API Key is missing.</div>;
  }

  // Prepare base step props (conforms to the updated StepProps)
  const baseStepProps: StepProps = {
    nextStep,
    prevStep,
    updateData,
    data,
  };

  // Wrapper calls renderWizardStep. renderWizardStep will now only render
  // the actual step component when status is SUCCESS.
  return (
    <Wrapper 
      apiKey={mapsApiKey} 
      libraries={['places']} 
      render={(status: Status) => renderWizardStep(status, step, baseStepProps)}
    />
  );
};

export default Wizard;