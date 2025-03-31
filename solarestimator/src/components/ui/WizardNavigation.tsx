import React from 'react';

interface WizardNavigationProps {
  onNext?: () => void;
  onPrev?: () => void;
  canProceed?: boolean;
  nextLabel?: string;
  prevLabel?: string;
}

export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  onNext,
  onPrev,
  canProceed = true,
  nextLabel = 'Next',
  prevLabel = 'Back'
}) => {
  return (
    <div className="flex justify-between w-full mt-6">
      {onPrev ? (
        <button 
          onClick={onPrev} 
          className="btn btn-secondary"
        >
          {prevLabel}
        </button>
      ) : (
        <div /> // Placeholder to keep next button aligned right
      )}
      
      {onNext && (
        <button 
          onClick={onNext} 
          className="btn btn-primary"
          disabled={!canProceed}
        >
          {nextLabel}
        </button>
      )}
    </div>
  );
};

export default WizardNavigation; 