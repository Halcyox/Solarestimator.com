import { useEffect, useState } from 'react';

interface SolarEstimatorProps {
  address: string;
  bill: number;
}

interface SolarEstimateResult {
  panelsNeeded: number;
  annualProduction: number;
  estimatedSavings: number;
}

export const SolarEstimator = ({ address, bill }: SolarEstimatorProps): JSX.Element => {
  const [results, setResults] = useState<SolarEstimateResult | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('Calculating your solar potential...');
  const [dotAnimation, setDotAnimation] = useState<string>('');

  useEffect(() => {
    const loadingMessages = [
      "Scanning solar patterns...",
      "Analyzing local weather data...",
      "Calculating optimal panel placement...",
      "Estimating cost savings..."
    ];

    let messageIndex = 0;
    let elapsedTime = 0;
    const totalLoadingTime = 6000;
    const updateInterval = 150;

    // Dot animation update interval
    const dotsInterval = setInterval(() => {
      setDotAnimation(dotAnimation => dotAnimation.length < 3 ? dotAnimation + '.' : '');
    }, 500);

    // Update progress and messages
    const progressInterval = setInterval(() => {
      elapsedTime += updateInterval;
      const progressPercentage = (elapsedTime / totalLoadingTime) * 100;

      // Update loading message
      if (progressPercentage >= (100 / loadingMessages.length) * (messageIndex + 1)) {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[messageIndex]);
      }

      // Complete loading
      if (progressPercentage >= 100) {
        clearInterval(progressInterval);
        clearInterval(dotsInterval);
        setResults({
          panelsNeeded: 20,
          annualProduction: 5000,
          estimatedSavings: 1200
        });
      }
    }, updateInterval);

    // Cleanup intervals on component unmount or dependency change
    return () => {
      clearInterval(progressInterval);
      clearInterval(dotsInterval);
    };
  }, [address, bill]);

  return (
    <div className="container mt-8 p-6 bg-white rounded-lg shadow-md animate-fadeIn">
      <h2 className="text-2xl font-semibold mb-4 text-center text-accent-color">Your Solar Estimate</h2>
      {results ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between transform transition-transform duration-500 hover:scale-105">
            <span className="font-semibold text-foreground-color">Panels needed:</span>
            <span className="text-2xl text-button-hover-color">{results.panelsNeeded}</span>
          </div>
          <div className="flex items-center justify-between transform transition-transform duration-500 hover:scale-105">
            <span className="font-semibold text-foreground-color">Annual production:</span>
            <span className="text-2xl text-accent-color">{results.annualProduction} kWh</span>
          </div>
          <div className="flex items-center justify-between transform transition-transform duration-500 hover:scale-105">
            <span className="font-semibold text-foreground-color">Estimated savings:</span>
            <span className="text-2xl text-accent-color">${results.estimatedSavings} per year</span>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg text-foreground-color animate-pulse mb-4">{loadingMessage}<span className="animate-blink">{dotAnimation}</span></p>
        </div>
      )}
    </div>
  );
};
