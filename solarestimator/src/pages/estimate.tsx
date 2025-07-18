import React, { useState } from 'react';
import EstimatorWizard from '../components/EstimatorWizard/EstimatorWizard';
import { WizardData } from '../components/EstimatorWizard/EstimatorWizard';
import ResultsStep from '../components/EstimatorWizard/steps/ResultsStep';
import '../styles/estimate-page.css';
import '../styles/material-ui-overrides.css';

const EstimatePage: React.FC = () => {
  const [isWizardCompleted, setIsWizardCompleted] = useState(false);
  const [wizardData, setWizardData] = useState<WizardData | null>(null);

  const handleWizardComplete = (data: WizardData) => {
    setWizardData(data);
    setIsWizardCompleted(true);
  };

  const handleGoBack = () => {
    setIsWizardCompleted(false);
  };

  return (
    <main className="estimate-page" style={{ width: '100%', margin: 0, padding: 0 }}>
      <div style={{ width: '100%', margin: 0, padding: 0 }}>
        {isWizardCompleted && wizardData ? (
          <ResultsStep
            data={wizardData}
            prevStep={handleGoBack}
            updateData={(newData) => setWizardData({ ...wizardData, ...newData })}
          />
        ) : (
          <EstimatorWizard onComplete={handleWizardComplete} />
        )}
      </div>
    </main>
  );
};

export default EstimatePage;
