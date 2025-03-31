import { useEffect, useState } from 'react';
import { fetchSolarData } from './apiHelper';
import RoofVisualization from './RoofVisualization';
import SavingsCalculator from './SavingsCalculator';

interface SolarEstimatorProps {
  address: string;
  bill: number;
}



interface SolarData {
  latitude: number;  // Add latitude
  longitude: number; // Add longitude
  maxArrayPanelsCount: number;
  maxArrayAreaMeters2: number;
  maxSunshineHoursPerYear: number;
  carbonOffsetFactorKgPerMwh: number;
  roofSegmentStats: any[]; // More specific type if available
}

export const SolarEstimator = ({ address, bill }: SolarEstimatorProps): JSX.Element => {
  const [solarData, setSolarData] = useState<SolarData | null>(null);
  const [totalEnergyProductionPerYearKwh, setTotalEnergyProductionPerYearKwh] = useState<number | null>(null);
  const [numberOfPanels, setNumberOfPanels] = useState<number>(20); // New state
  const [numberOfYears, setNumberOfYears] = useState<number>(10);  // Default to 10 years

  const [shadingFactor, setShadingFactor] = useState<number>(90); // New state
  const [tiltFactor, setTiltFactor] = useState<number>(90); // New state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSetSolarData = async () => {
      try {
        setLoading(true);
        const data = await fetchSolarData(address);  // Now includes lat and lng
        setSolarData(data);

        const solarEfficiency = 0.85;
        const averagePanelOutputKw = 0.3;
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

  const handleYearChange = (newYears: number) => {
    setNumberOfYears(newYears);
  };

  if (loading) return <div>Loading solar data...</div>;
  if (error) return <div>{error}</div>;
  if (!solarData || totalEnergyProductionPerYearKwh === null) return <div>No solar data available</div>;

  return (
    <div className="container mt-8 p-6 bg-white rounded-lg shadow-md animate-fadeIn">
      <h2 className="text-2xl font-semibold mb-4 text-center text-accent-color">Your Solar Estimate</h2>

      <RoofVisualization
        latitude={solarData.latitude}
        longitude={solarData.longitude}
        roofSegments={solarData.roofSegmentStats}
        numberOfPanels={numberOfPanels}
        shadingFactor={shadingFactor}
        tiltFactor={tiltFactor}
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_SOLAR_API_KEY ?? ''}
      />

      <SavingsCalculator
        solarData={solarData}
        bill={bill}
        totalEnergyProductionPerYearKwh={totalEnergyProductionPerYearKwh}
        onPanelChange={setNumberOfPanels}
        onShadingChange={setShadingFactor}
        onTiltChange={setTiltFactor}
        onYearChange={handleYearChange}
      />
      
    </div>
  );
};
