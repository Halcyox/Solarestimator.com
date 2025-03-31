// Define interfaces for better type safety

// Basic location types
interface LatLngLiteral {
  latitude: number;
  longitude: number;
}

interface BoundingBox {
  sw: LatLngLiteral;
  ne: LatLngLiteral;
}

// Type for individual roof segment statistics
export interface RoofSegmentStat {
  pitchDegrees: number;
  azimuthDegrees: number;
  stats: {
    areaMeters2: number;
    sunshineQuantiles: number[];
  };
  center: LatLngLiteral;
  boundingBox: BoundingBox;
  planeHeightAtCenterMeters: number;
}

// Add SolarPanel type (extracted from BuildingInsights initially)
export interface SolarPanel {
  center: LatLngLiteral;
  orientation: string; // e.g., "PORTRAIT", "LANDSCAPE"
  yearlyEnergyDcKwh: number;
  segmentIndex: number;
}

// Update SolarPotential to use SolarPanel type
interface SolarPotential {
  maxArrayPanelsCount?: number;
  maxArrayAreaMeters2?: number;
  maxSunshineHoursPerYear?: number;
  carbonOffsetFactorKgPerMwh?: number;
  roofSegmentStats?: RoofSegmentStat[];
  solarPanels?: SolarPanel[]; // Use the specific type
}

// Define BuildingInsights interface here, using the above types
export interface BuildingInsights {
  solarPotential?: SolarPotential; // Make optional, as the whole object might be missing
  // Include other top-level fields from the API response if needed
  // e.g., name, center, imageryDate, etc.
  name?: string; // Example: often the address or identifier
  center?: LatLngLiteral;
  imageryDate?: { year: number, month: number, day: number };
}

// FetchedSolarData can potentially be simplified or derived from BuildingInsights
// For now, keep it separate as it represents the *processed* data we pass around
export interface FetchedSolarData {
  latitude: number;
  longitude: number;
  maxArrayPanelsCount?: number;
  maxArrayAreaMeters2?: number;
  maxSunshineHoursPerYear?: number;
  carbonOffsetFactorKgPerMwh?: number;
  roofSegmentStats?: RoofSegmentStat[];
}

// Type for Geocoding API Response (simplified)
interface GeocodeLocation {
  lat: number;
  lng: number;
}
interface GeocodeGeometry {
  location: GeocodeLocation;
}
interface GeocodeResult {
  geometry: GeocodeGeometry;
}
interface GeocodeResponse {
  results: GeocodeResult[];
  status: string;
}

/**
 * Fetches solar potential data for a given address using Google's Geocoding and Solar APIs
 * 
 * This function performs two main operations:
 * 1. Converts the address to latitude and longitude using Google's Geocoding API
 * 2. Retrieves solar potential data using Google's Solar API
 * 
 * @param {string} address - The street address to analyze for solar potential
 * @returns {Promise<FetchedSolarData>} A promise that resolves to structured solar potential data
 * 
 * @throws {Error} Throws an error if:
 * - API keys are missing
 * - Geocoding fails
 * - Solar API request fails
 * - Any network or parsing errors occur
 */
export async function fetchSolarData(address: string): Promise<FetchedSolarData> {
  const geocodeApiKey = process.env.NEXT_PUBLIC_GOOGLE_GEOCODE_API_KEY;
  const solarApiKey = process.env.NEXT_PUBLIC_GOOGLE_SOLAR_API_KEY;

  // Validate API keys
  if (!geocodeApiKey || !solarApiKey) {
    console.error('API keys are missing. Check environment variables.');
    throw new Error('API keys are missing');
  }

  try {
    // 1. Geocoding to get latitude and longitude
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${geocodeApiKey}`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData: GeocodeResponse = await geocodeResponse.json();

    if (!geocodeResponse.ok || geocodeData.status !== 'OK' || !geocodeData.results || geocodeData.results.length === 0) {
      console.error('Geocoding failed:', geocodeData);
      throw new Error(`Failed to geocode address "${address}". Status: ${geocodeData.status}`);
    }

    // Extract coordinates from geocoding response
    const { lat, lng } = geocodeData.results[0].geometry.location;

    // 2. Use latitude and longitude for Solar API
    const solarApiUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${solarApiKey}`;
    const solarResponse = await fetch(solarApiUrl);
    // Type the response directly as BuildingInsights
    const buildingInsightsData: BuildingInsights = await solarResponse.json();

    if (!solarResponse.ok || !buildingInsightsData) {
      console.error('Fetching solar data failed. Status:', solarResponse.status, 'Response:', buildingInsightsData);
      throw new Error(`Failed to fetch solar data for location (${lat}, ${lng}). Status: ${solarResponse.status}`);
    }

    // 3. Structure the relevant data from Solar API
    // Check if solarPotential exists before trying to access its properties
    const solarPotential = buildingInsightsData.solarPotential;

    const structuredData: FetchedSolarData = {
      latitude: lat,
      longitude: lng,
      maxArrayPanelsCount: solarPotential?.maxArrayPanelsCount,
      maxArrayAreaMeters2: solarPotential?.maxArrayAreaMeters2,
      maxSunshineHoursPerYear: solarPotential?.maxSunshineHoursPerYear,
      carbonOffsetFactorKgPerMwh: solarPotential?.carbonOffsetFactorKgPerMwh,
      roofSegmentStats: solarPotential?.roofSegmentStats,
    };

    console.log('Structured Data:', JSON.stringify(structuredData, null, 2));

    return structuredData;
  } catch (error) {
    // Type check the caught error
    let errorMessage = 'An unknown error occurred while fetching data.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    console.error('Error in fetchSolarData:', error); // Log the original error
    throw new Error(`Failed to fetch solar data: ${errorMessage}`);
  }
}