import React from 'react';

/**
 * Props interface for the EnvironmentalImpact component
 * @interface EnvironmentalImpactProps
 * @property {number} totalEnergyProductionPerYearKwh - Total energy production in kilowatt-hours per year
 */
interface EnvironmentalImpactProps {
  totalEnergyProductionPerYearKwh: number;
}

/**
 * EnvironmentalImpact Component
 * 
 * Calculates and displays the environmental impact of solar energy production
 * in terms of CO₂ emissions offset, equivalent trees saved, and cars removed from the road.
 * 
 * Calculations are based on:
 * - US average CO₂ emissions per kWh (0.475 kg)
 * - Average CO₂ absorption per tree per year (22 kg)
 * - Average car CO₂ emissions per year (4.6 metric tons)
 * 
 * @component
 * @param {EnvironmentalImpactProps} props - Component props
 * @param {number} props.totalEnergyProductionPerYearKwh - Total energy production in kWh/year
 * @returns {JSX.Element} Rendered component showing environmental impact metrics
 * 
 * @example
 * ```tsx
 * <EnvironmentalImpact totalEnergyProductionPerYearKwh={10000} />
 * ```
 */
const EnvironmentalImpact: React.FC<EnvironmentalImpactProps> = ({ totalEnergyProductionPerYearKwh }) => {
  /**
   * Average CO₂ emissions per kilowatt-hour in the United States
   * Source: EPA eGRID 2021 data
   * @constant {number}
   */
  const kgCO2PerKwh = 0.475; // Average CO2 emissions per kWh (US average)

  /**
   * Average CO₂ absorption per tree per year
   * Source: US Forest Service
   * @constant {number}
   */
  const kgCO2OffsetPerTree = 22; // Roughly 22 kg CO2 absorbed per year per tree

  /**
   * Average car CO₂ emissions per year in kilograms
   * Source: EPA vehicle emissions data
   * @constant {number}
   */
  const kgCO2OffsetPerCar = 4.6 * 1000; // Average car emits 4.6 metric tons (4600 kg) of CO2 per year

  /**
   * Calculate total CO₂ offset based on energy production
   * @constant {number}
   */
  const totalCO2OffsetKg = totalEnergyProductionPerYearKwh * kgCO2PerKwh;

  /**
   * Calculate equivalent number of trees based on CO₂ offset
   * @constant {number}
   */
  const treesSaved = totalCO2OffsetKg / kgCO2OffsetPerTree;

  /**
   * Calculate equivalent number of cars removed from road based on CO₂ offset
   * @constant {number}
   */
  const carsRemovedFromRoad = totalCO2OffsetKg / kgCO2OffsetPerCar;

  return (
    <div>
      <h3>Environmental Impact</h3>
      <ul>
        <li>
          <strong>Total CO₂ offset:</strong> {totalCO2OffsetKg.toFixed(2)} kg/year
        </li>
        <li>
          <strong>Trees saved:</strong> {treesSaved.toFixed(2)} trees/year
        </li>
        <li>
          <strong>Cars removed from the road:</strong> {carsRemovedFromRoad.toFixed(2)} cars/year
        </li>
      </ul>
    </div>
  );
};

export default EnvironmentalImpact;
