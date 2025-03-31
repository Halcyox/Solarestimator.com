// steps/SystemParametersStep.tsx
import React, { useState, useEffect } from 'react';
import { WizardData } from '../Wizard';
import { StepContainer, FormField, TextInput, WizardNavigation, Slider } from '../ui';

interface SystemParametersStepProps {
  nextStep: () => void;
  prevStep?: () => void;
  updateData: (newData: Partial<WizardData>) => void;
  data: WizardData;
}

const SystemParametersStep: React.FC<SystemParametersStepProps> = ({ nextStep, prevStep, updateData, data }) => {
  // Local state for inputs
  const maxPanels = data.solarData?.maxArrayPanelsCount;
  const [currentPanels, setCurrentPanels] = useState<string>(
    data.numberOfPanels > 0 ? String(data.numberOfPanels) : ''
  );
  const [currentShading, setCurrentShading] = useState<number>(data.shadingFactor || 90);
  const [currentTilt, setCurrentTilt] = useState<number>(data.tiltFactor || 90);
  
  const [panelError, setPanelError] = useState<string | null>(null);
  // No error state needed for sliders as they are constrained by min/max

  // Update local state if data changes from parent (e.g., initial fetch clamps panels)
  useEffect(() => {
      setCurrentPanels(data.numberOfPanels > 0 ? String(data.numberOfPanels) : '');
      setCurrentShading(data.shadingFactor || 90);
      setCurrentTilt(data.tiltFactor || 90);
  }, [data.numberOfPanels, data.shadingFactor, data.tiltFactor]);

  const handlePanelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
     if (/^\d*$/.test(value)) { // Allow only whole numbers
        setCurrentPanels(value);
        // Validate
        const num = Number(value);
        if (value && (isNaN(num) || num <= 0)) {
            setPanelError('Must be a positive number.');
        } else if (maxPanels !== undefined && num > maxPanels) {
            setPanelError(`Maximum panels for this roof is ${maxPanels}.`);
        } else {
            setPanelError(null);
        }
     } else if (value === '') {
         setCurrentPanels('');
         setPanelError('Number of panels is required.');
     }
  };

  const handleShadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentShading(Number(e.target.value));
  };

  const handleTiltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTilt(Number(e.target.value));
  };

  const handleNext = () => {
    let isValid = true;
    setPanelError(null);
    
    const panelNumber = Number(currentPanels);
    if (!currentPanels || isNaN(panelNumber) || panelNumber <= 0) {
        setPanelError('Number of panels is required and must be positive.');
        isValid = false;
    } else if (maxPanels !== undefined && panelNumber > maxPanels) {
        setPanelError(`Maximum panels for this roof is ${maxPanels}.`);
        isValid = false;
    }
    
    // Shading/Tilt are always valid due to slider constraints

    if (isValid) {
      updateData({ 
          numberOfPanels: panelNumber, 
          shadingFactor: currentShading, 
          tiltFactor: currentTilt 
      });
      nextStep();
    }
  };

  // Determine if Next button should be enabled
  const canProceed = !!currentPanels && Number(currentPanels) > 0 && !panelError;

  return (
    <StepContainer title="Step 3: System Details">
      <div className="w-full">
        {/* Number of Panels Input */}
        <FormField
          id="panel-input"
          label={`Number of Panels ${maxPanels !== undefined ? `(Max: ${maxPanels})` : ''}`}
          error={panelError}
        >
          <TextInput 
            id="panel-input"
            type="text"
            inputMode="numeric"
            placeholder="e.g., 20"
            value={currentPanels}
            onChange={handlePanelChange}
            hasError={!!panelError}
          />
        </FormField>
        
        {/* Shading Factor Slider */}
        <FormField
          id="shading-slider"
          label={
            <>
              Shading Factor: {currentShading}%
              <span className="text-xs text-gray-500 ml-2">(Estimated % sunlight blocked)</span>
            </>
          }
          error={null}
        >
          <Slider 
            id="shading-slider"
            min={0}
            max={100}
            step={5}
            value={currentShading}
            onChange={handleShadingChange}
          />
        </FormField>
        
        {/* Tilt Factor Slider */}
        <FormField
          id="tilt-slider"
          label={
            <>
              Tilt & Orientation Factor: {currentTilt}%
              <span className="text-xs text-gray-500 ml-2">(Estimated efficiency vs optimal)</span>
            </>
          }
          error={null}
        >
          <Slider 
            id="tilt-slider"
            min={0}
            max={100}
            step={5}
            value={currentTilt}
            onChange={handleTiltChange}
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

export default SystemParametersStep;