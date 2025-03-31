/**
 * Interface for the structured solar data returned by the API
 * @interface SolarDataResponse
 */
interface APIBoundingBox {
  ne: {
    latitude: number;
    longitude: number;
  };
  sw: {
    latitude: number;
    longitude: number;
  };
}

interface APIRoofSegment {
  boundingBox?: APIBoundingBox;
  [key: string]: any;
}

interface BoundingBox {
  n: number;
  s: number;
  e: number;
  w: number;
}

interface RoofSegment {
  boundingBox: BoundingBox | null;
  [key: string]: any; // Allow other properties from the API
}

interface SolarDataResponse {
  /** Latitude coordinate of the location */
  latitude: number;
  /** Longitude coordinate of the location */
  longitude: number;
  /** Maximum number of solar panels that can be installed */
  maxArrayPanelsCount: number | undefined;
  /** Maximum area in square meters available for solar panels */
  maxArrayAreaMeters2: number | undefined;
  /** Maximum sunshine hours per year at the location */
  maxSunshineHoursPerYear: number | undefined;
  /** Carbon offset factor in kilograms per megawatt-hour */
  carbonOffsetFactorKgPerMwh: number | undefined;
  /** Statistics about different roof segments */
  roofSegmentStats: RoofSegment[] | undefined;
}

/**
 * Fetches solar potential data for a given address using Google's Geocoding and Solar APIs
 * 
 * This function performs two main operations:
 * 1. Converts the address to latitude and longitude using Google's Geocoding API
 * 2. Retrieves solar potential data using Google's Solar API
 * 
 * @param {string} address - The street address to analyze for solar potential
 * @returns {Promise<SolarDataResponse>} A promise that resolves to structured solar potential data
 * 
 * @throws {Error} Throws an error if:
 * - API keys are missing
 * - Geocoding fails
 * - Solar API request fails
 * - Any network or parsing errors occur
 * 
 * @example
 * ```typescript
 * try {
 *   const solarData = await fetchSolarData('123 Main St, City, State');
 *   console.log('Maximum panels possible:', solarData.maxArrayPanelsCount);
 * } catch (error) {
 *   console.error('Failed to fetch solar data:', error);
 * }
 * ```
 */
export async function fetchSolarData(address: string): Promise<SolarDataResponse> {
  // Get API keys from environment variables
  const geocodeApiKey = process.env.NEXT_PUBLIC_GOOGLE_GEOCODE_API_KEY;
  const solarApiKey = process.env.NEXT_PUBLIC_GOOGLE_SOLAR_API_KEY;

  // Validate API keys
  if (!geocodeApiKey || !solarApiKey) {
    throw new Error('API keys are missing');
  }

  try {
    // Step 1: Geocoding to get latitude and longitude
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${geocodeApiKey}`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    // Validate geocoding response
    if (!geocodeResponse.ok || !geocodeData.results.length) {
      throw new Error('Failed to geocode address');
    }

    // Extract coordinates from geocoding response
    const { lat, lng } = geocodeData.results[0].geometry.location;

    // Step 2: Fetch solar potential data using coordinates
    const solarApiUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${solarApiKey}`;
    const solarResponse = await fetch(solarApiUrl);
    const solarData = await solarResponse.json();

    // Validate solar API response
    if (!solarResponse.ok) {
      throw new Error('Failed to fetch solar data');
    }

    // Structure the relevant data from Solar API
    const structuredData: SolarDataResponse = {
      latitude: lat,  // Add latitude
      longitude: lng, // Add longitude
      maxArrayPanelsCount: solarData.solarPotential?.maxArrayPanelsCount,
      maxArrayAreaMeters2: solarData.solarPotential?.maxArrayAreaMeters2,
      maxSunshineHoursPerYear: solarData.solarPotential?.maxSunshineHoursPerYear,
      carbonOffsetFactorKgPerMwh: solarData.solarPotential?.carbonOffsetFactorKgPerMwh,
      roofSegmentStats: solarData.solarPotential?.roofSegmentStats?.map((segment: APIRoofSegment) => ({
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
  } catch (error: unknown) {
    // Handle both Error objects and unknown error types
    if (error instanceof Error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
    // If it's not an Error object, convert it to a string
    throw new Error(`Failed to fetch data: ${String(error)}`);
  }
}