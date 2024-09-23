import { useEffect, useState } from 'react';
import { fetchSolarData } from './apiHelper';
import RoofVisualization from './RoofVisualization';
import SavingsCalculator from './SavingsCalculator';
import EnvironmentalImpact from './EnvironmentalImpact';

interface SolarEstimatorProps {
  address: string;
  bill: number;
}

interface SolarData {
  maxArrayPanelsCount: number;
  maxArrayAreaMeters2: number;
  maxSunshineHoursPerYear: number;
  carbonOffsetFactorKgPerMwh: number;
  roofSegmentStats: any[]; // Define a more specific type if possible
}

export const SolarEstimator = ({ address, bill }: SolarEstimatorProps): JSX.Element => {
  const [solarData, setSolarData] = useState<SolarData | null>(null);
  const [totalEnergyProductionPerYearKwh, setTotalEnergyProductionPerYearKwh] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSetSolarData = async () => {
      try {
        setLoading(true);
        const data = await fetchSolarData(address);
        setSolarData(data);

        // Calculate total energy production (realistic calculations based on fetched data)
        const solarEfficiency = 0.85; // Adjust based on shading, tilt, etc.
        const averagePanelOutputKw = 0.3; // Average output of 300 watts per panel
        const totalKwh = data.maxArrayPanelsCount * averagePanelOutputKw * data.maxSunshineHoursPerYear * solarEfficiency;

        setTotalEnergyProductionPerYearKwh(totalKwh);
      } catch (err) {
        setError('Error fetching solar data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetSolarData();
  }, [address]);

  if (loading) return <div>Loading solar data...</div>;
  if (error) return <div>{error}</div>;
  if (!solarData || totalEnergyProductionPerYearKwh === null) return <div>No solar data available</div>;

  return (
    <div className="container mt-8 p-6 bg-white rounded-lg shadow-md animate-fadeIn">
      <h2 className="text-2xl font-semibold mb-4 text-center text-accent-color">Your Solar Estimate</h2>
      <RoofVisualization roofSegments={solarData.roofSegmentStats} />
      
      {/* Pass down totalEnergyProductionPerYearKwh to both the SavingsCalculator and EnvironmentalImpact */}
      <SavingsCalculator solarData={solarData} bill={bill} totalEnergyProductionPerYearKwh={totalEnergyProductionPerYearKwh} />
      <EnvironmentalImpact totalEnergyProductionPerYearKwh={totalEnergyProductionPerYearKwh} />
    </div>
  );
};
