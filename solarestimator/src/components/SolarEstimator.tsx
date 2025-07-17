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
  onFinancingOptionChange?: (option: FinancingOption) => void;
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
    onFinancingOptionChange,
  } = props;

  if (!solarData) {
    return (
      <div className="text-center p-8 bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-lg">
        <div className="text-red-600 text-lg font-semibold mb-2">⚠️ Error</div>
        <div className="text-red-500">Solar data is missing. Please try again.</div>
      </div>
    );
  }

  const dummyHandler = () => {};

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Your Solar Estimate
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Personalized analysis based on your property and energy usage
        </p>
      </div>

      {/* Roof Visualization Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            🏠 Roof Analysis & Panel Layout
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Interactive visualization of your roof segments and optimal solar panel placement
          </p>
        </div>
        <div className="p-6">
          <RoofVisualization
            latitude={solarData.latitude}
            longitude={solarData.longitude}
            roofSegments={solarData.roofSegmentStats ?? []}
            numberOfPanels={numberOfPanels}
            shadingFactor={shadingFactor}
            tiltFactor={tiltFactor}
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_SOLAR_API_KEY ?? ''}
          />
        </div>
      </div>

      {/* Savings Calculator Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            💰 Financial Analysis & Savings
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Detailed breakdown of costs, savings, and return on investment
          </p>
        </div>
        <div className="p-6">
          <SavingsCalculator
            solarData={solarData}
            bill={bill}
            totalEnergyProductionPerYearKwh={totalEnergyProductionPerYearKwh}
            numberOfPanels={numberOfPanels}
            shadingFactor={shadingFactor}
            tiltFactor={tiltFactor}
            financingOption={financingOption}
            onFinancingOptionChange={onFinancingOptionChange}
            onPanelChange={dummyHandler}
            onShadingChange={dummyHandler}
            onTiltChange={dummyHandler}
            onYearChange={dummyHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default SolarEstimator;
