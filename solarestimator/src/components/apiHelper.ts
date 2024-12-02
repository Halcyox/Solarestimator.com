export async function fetchSolarData(address: string) {
  const geocodeApiKey = process.env.NEXT_PUBLIC_GOOGLE_GEOCODE_API_KEY;
  const solarApiKey = process.env.NEXT_PUBLIC_GOOGLE_SOLAR_API_KEY;

  if (!geocodeApiKey || !solarApiKey) {
    throw new Error('API keys are missing');
  }

  try {
    // Geocoding to get latitude and longitude
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${geocodeApiKey}`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (!geocodeResponse.ok || !geocodeData.results.length) {
      throw new Error('Failed to geocode address');
    }

    const { lat, lng } = geocodeData.results[0].geometry.location;

    // Use latitude and longitude for Solar API
    const solarApiUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${solarApiKey}`;
    const solarResponse = await fetch(solarApiUrl);
    const solarData = await solarResponse.json();

    if (!solarResponse.ok) {
      throw new Error('Failed to fetch solar data');
    }

    // Structure the relevant data from Solar API
    console.log('Raw Solar API Response:', JSON.stringify(solarData, null, 2));
    
    const structuredData = {
      latitude: lat,  // Add latitude
      longitude: lng, // Add longitude
      maxArrayPanelsCount: solarData.solarPotential?.maxArrayPanelsCount,
      maxArrayAreaMeters2: solarData.solarPotential?.maxArrayAreaMeters2,
      maxSunshineHoursPerYear: solarData.solarPotential?.maxSunshineHoursPerYear,
      carbonOffsetFactorKgPerMwh: solarData.solarPotential?.carbonOffsetFactorKgPerMwh,
      roofSegmentStats: solarData.solarPotential?.roofSegmentStats?.map(segment => ({
        ...segment,
        bounds: segment.boundingBox ? {
          n: segment.boundingBox.ne.latitude,
          s: segment.boundingBox.sw.latitude,
          e: segment.boundingBox.ne.longitude,
          w: segment.boundingBox.sw.longitude
        } : null
      }))
    };

    console.log('Structured Data:', JSON.stringify(structuredData, null, 2));

    return structuredData;
  } catch (error) {
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
}
