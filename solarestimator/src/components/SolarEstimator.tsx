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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSetSolarData = async () => {
      try {
        setLoading(true);
        const data = await fetchSolarData(address);
        setSolarData(data);
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
  if (!solarData) return <div>No solar data available</div>;

  return (
    <div className="container mt-8 p-6 bg-white rounded-lg shadow-md animate-fadeIn">
      <h2 className="text-2xl font-semibold mb-4 text-center text-accent-color">Your Solar Estimate</h2>
      <RoofVisualization roofSegments={solarData.roofSegmentStats} />
      <SavingsCalculator solarData={solarData} bill={bill} />
      <EnvironmentalImpact solarData={solarData} />
    </div>
  );
};
