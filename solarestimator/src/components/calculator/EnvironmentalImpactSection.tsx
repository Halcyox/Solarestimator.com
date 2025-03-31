import React, { useState, useEffect } from 'react';

interface EnvironmentalImpactProps {
  energyProductionKwh: number; // Total energy production over the specified years
  years: number; // Number of years
  region: string; // Region for localized emission factors
}

interface EnvironmentalImpactState {
  co2OffsetKg: number;
  treesSaved: number;
  carsRemoved: number;
  co2EmissionFactor: number; // CO2 emission factor based on region
  energyProductionTotalKwh: number; // Total energy over the specified years
}

const EnvironmentalImpactSection: React.FC<EnvironmentalImpactProps> = ({
  energyProductionKwh,
  years,
  region
}) => {
  const [impact, setImpact] = useState<EnvironmentalImpactState>({
    co2OffsetKg: 0,
    treesSaved: 0,
    carsRemoved: 0,
    co2EmissionFactor: 0.475, // Default to a reasonable global average unless specified
    energyProductionTotalKwh: 0
  });

  useEffect(() => {
    const emissionFactors: { [key: string]: number } = {
      'USA': 0.475,
      'Europe': 0.350,
      'Asia': 0.540,
      'Global': 0.475 // Default global average value
    };

    const co2EmissionFactor = emissionFactors[region] || emissionFactors['Global'];
    const energyProductionTotalKwh = energyProductionKwh; // Already total over the specified years
    const co2OffsetKg = energyProductionTotalKwh * co2EmissionFactor; // Total CO2 offset in kg
    const treesSaved = co2OffsetKg / 22; // Trees saved based on CO2 absorption
    const carsRemoved = co2OffsetKg / 4600 ; // Cars removed from the road equivalent

    setImpact({
      co2OffsetKg,
      treesSaved,
      carsRemoved,
      co2EmissionFactor,
      energyProductionTotalKwh
    });
  }, [energyProductionKwh, years, region]);

  return (
    <div>
      <h3>Environmental Impact Over {years} Year{years > 1 ? 's' : ''} in {region}</h3>
      <ul>
        <li>Total Energy Produced: <strong>{impact.energyProductionTotalKwh.toFixed(2)} kWh</strong></li>
        <li>Total CO₂ Offset: <strong>{impact.co2OffsetKg.toFixed(2)} kg</strong></li>
        <li>Trees Saved: <strong>{impact.treesSaved.toFixed(2)}</strong> trees</li>
        <li>Cars Removed from Road: <strong>{impact.carsRemoved.toFixed(2)}</strong> cars</li>
      </ul>
    </div>
  );
};

export default EnvironmentalImpactSection;
