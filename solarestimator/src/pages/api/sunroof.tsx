import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  const apiUrl = `https://sunroof.googleapis.com/v1/sunroof?location=${encodeURIComponent(address)}&key=AIzaSyCAPPDpM4I6phkrMU-4xsF9GKE7W-_B1T4`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    
    
    // Parse and structure the relevant data
    const structuredData = {
      maxArrayPanelsCount: data.solarPotential.maxArrayPanelsCount,
      maxArrayAreaMeters2: data.solarPotential.maxArrayAreaMeters2,
      maxSunshineHoursPerYear: data.solarPotential.maxSunshineHoursPerYear,
      carbonOffsetFactorKgPerMwh: data.solarPotential.carbonOffsetFactorKgPerMwh,
      roofSegmentStats: data.solarPotential.roofSegmentStats,
      // Add more fields as needed
    };

    res.status(200).json(structuredData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch solar data' });
  }
}