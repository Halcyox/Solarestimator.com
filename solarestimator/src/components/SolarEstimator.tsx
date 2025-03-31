// SolarEstimator.tsx
import React from 'react';
import { FetchedSolarData, RoofSegmentStat } from './apiHelper';
import RoofVisualization from './RoofVisualization';
import SavingsCalculator from './SavingsCalculator';
import { FinancingOption } from './Wizard';

interface SolarEstimatorProps {
  solarData: FetchedSolarData;
  totalEnergyProductionPerYearKwh: number | null;
  bill: number;
  numberOfPanels: number;
  shadingFactor: number;
  tiltFactor: number;
  financingOption: FinancingOption;
}

const SolarEstimator: React.FC<SolarEstimatorProps> = (props) => {
  const {
    solarData,
    totalEnergyProductionPerYearKwh,
    bill,
    numberOfPanels,
    shadingFactor,
    tiltFactor,
    financingOption,
  } = props;

  if (!solarData) {
    return <div className="text-center p-4 text-red-600">Error: Solar data is missing.</div>;
  }

  const dummyHandler = () => {};

  return (
    <div className="container mt-8 p-6 bg-white rounded-lg shadow-md animate-fadeIn">
      <h2 className="text-2xl font-semibold mb-4 text-center text-accent-color">
        Your Solar Estimate
      </h2>

      <RoofVisualization
        latitude={solarData.latitude}
        longitude={solarData.longitude}
        roofSegments={solarData.roofSegmentStats ?? []}
        numberOfPanels={numberOfPanels}
        shadingFactor={shadingFactor}
        tiltFactor={tiltFactor}
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_SOLAR_API_KEY ?? ''}
      />

      <SavingsCalculator
        solarData={solarData}
        bill={bill}
        totalEnergyProductionPerYearKwh={totalEnergyProductionPerYearKwh}
        numberOfPanels={numberOfPanels}
        shadingFactor={shadingFactor}
        tiltFactor={tiltFactor}
        financingOption={financingOption}
        onPanelChange={dummyHandler}
        onShadingChange={dummyHandler}
        onTiltChange={dummyHandler}
        onYearChange={dummyHandler}
      />
    </div>
  );
};

export default SolarEstimator;
