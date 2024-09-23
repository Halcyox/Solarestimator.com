import React from 'react';

interface SavingsCalculatorProps {
  solarData: {
    maxArrayPanelsCount: number;
    maxArrayAreaMeters2: number;
    maxSunshineHoursPerYear: number;
    carbonOffsetFactorKgPerMwh: number;
  };
  bill: number; // Assuming 'bill' is a numeric value representing the user's monthly electricity bill
}

const SavingsCalculator: React.FC<SavingsCalculatorProps> = ({ solarData, bill }) => {
  // Placeholder logic to calculate savings
  // You might want to calculate savings based on solar production potential and current electricity costs
  const yearlySavings = (solarData.maxSunshineHoursPerYear * solarData.carbonOffsetFactorKgPerMwh * 0.12) - bill * 12;

  return (
    <div>
      <h3>Estimated Annual Savings</h3>
      <p>${yearlySavings.toFixed(2)} per year</p>
      <p>Details:</p>
      <ul>
        <li>Max Panels Count: {solarData.maxArrayPanelsCount}</li>
        <li>Max Area in Square Meters: {solarData.maxArrayAreaMeters2}</li>
        <li>Max Sunshine Hours per Year: {solarData.maxSunshineHoursPerYear}</li>
        <li>Carbon Offset (Kg/MWh): {solarData.carbonOffsetFactorKgPerMwh}</li>
      </ul>
    </div>
  );
};

export default SavingsCalculator;
