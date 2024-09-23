import React from 'react';

interface EnvironmentalImpactProps {
  solarData: {
    maxSunshineHoursPerYear: number;
    maxArrayPanelsCount: number;
    carbonOffsetFactorKgPerMwh: number;
  };
  totalEnergyProductionPerYearKwh: number; // Calculated in the savings calculator
}

const EnvironmentalImpact: React.FC<EnvironmentalImpactProps> = ({ solarData, totalEnergyProductionPerYearKwh }) => {
  const kgCO2PerKwh = 0.475; // Average CO2 emissions per kWh (US average)
  const kgCO2OffsetPerTree = 22; // Roughly 22 kg CO2 absorbed per year per tree
  const kgCO2OffsetPerCar = 4.6 * 1000; // Average car emits 4.6 metric tons (4600 kg) of CO2 per year

  const totalCO2OffsetKg = totalEnergyProductionPerYearKwh * kgCO2PerKwh;
  const treesSaved = totalCO2OffsetKg / kgCO2OffsetPerTree;
  const carsRemovedFromRoad = totalCO2OffsetKg / kgCO2OffsetPerCar;

  return (
    <div>
      <h3>Environmental Impact</h3>
      <ul>
        <li><strong>Total CO₂ offset:</strong> {totalCO2OffsetKg.toFixed(2)} kg/year</li>
        <li><strong>Trees saved:</strong> {treesSaved.toFixed(2)} trees/year</li>
        <li><strong>Cars removed from the road:</strong> {carsRemovedFromRoad.toFixed(2)} cars/year</li>
      </ul>
    </div>
  );
};

export default EnvironmentalImpact;
