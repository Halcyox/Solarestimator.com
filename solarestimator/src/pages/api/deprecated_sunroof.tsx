// import type { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { address } = req.query;
//   console.log('Received address:', address); // Log the received address

//   if (!address) {
//     return res.status(400).json({ error: 'Address is required' });
//   }

//   const geocodeApiKey = process.env.NEXT_PUBLIC_GOOGLE_GEOCODE_API_KEY;
//   const solarApiKey = process.env.NEXT_PUBLIC_GOOGLE_SOLAR_API_KEY;

//   if (!geocodeApiKey || !solarApiKey) {
//     return res.status(500).json({ error: 'API keys are missing' });
//   }

//   // Geocoding to get latitude and longitude
//   const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${geocodeApiKey}`;
//   try {
//     const geocodeResponse = await fetch(geocodeUrl);
//     const geocodeData = await geocodeResponse.json();
//     console.log('Geocode response data:', geocodeData); // Log the geocode data

//     if (!geocodeResponse.ok || !geocodeData.results.length) {
//       throw new Error('Failed to geocode address');
//     }

//     const { lat, lng } = geocodeData.results[0].geometry.location;
//     console.log('Coordinates:', { lat, lng }); // Log the extracted coordinates

//     // Use latitude and longitude for Solar API
//     const solarApiUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${solarApiKey}`;
//     const solarResponse = await fetch(solarApiUrl);
//     const solarData = await solarResponse.json();
//     console.log('Solar API response data:', solarData); // Log the solar data

//     if (!solarResponse.ok) {
//       throw new Error('Failed to fetch solar data');
//     }

//     // Structured the relevant data from Solar API
//     const structuredData = {
//       maxArrayPanelsCount: solarData.solarPotential?.maxArrayPanelsCount,
//       maxArrayAreaMeters2: solarData.solarPotential?.maxArrayAreaMeters2,
//       maxSunshineHoursPerYear: solarData.solarPotential?.maxSunshineHoursPerYear,
//       carbonOffsetFactorKgPerMwh: solarData.solarPotential?.carbonOffsetFactorKgPerMwh,
//       roofSegmentStats: solarData.solarPotential?.roofSegmentStats,
//     };

//     console.log('Structured data to return:', structuredData); // Log the structured data

//     res.status(200).json(structuredData);
//   } catch (error) {
//     console.error('API Error:', error);
//     res.status(500).json({ error: error.message || 'Failed to fetch data' });
//   }
// }
