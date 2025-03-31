<<<<<<< Updated upstream
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
=======
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

// Update SolarDataResponse to use BuildingInsights
// Note: The API returns the BuildingInsights structure directly, 
// sometimes nested under a different key depending on the exact endpoint/query.
// Assuming findClosest returns it at the top level or similar.
// If it's nested (e.g., under an `insights` key), adjust this type.
type SolarDataResponse = BuildingInsights;

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

export async function fetchSolarData(address: string): Promise<FetchedSolarData> {
>>>>>>> Stashed changes
  const geocodeApiKey = process.env.NEXT_PUBLIC_GOOGLE_GEOCODE_API_KEY;
  const solarApiKey = process.env.NEXT_PUBLIC_GOOGLE_SOLAR_API_KEY;

  // Validate API keys
  if (!geocodeApiKey || !solarApiKey) {
    console.error('API keys are missing. Check environment variables.');
    throw new Error('API keys are missing');
  }

  try {
<<<<<<< Updated upstream
    // Step 1: Geocoding to get latitude and longitude
=======
    // 1. Geocoding to get latitude and longitude
>>>>>>> Stashed changes
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${geocodeApiKey}`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData: GeocodeResponse = await geocodeResponse.json();

<<<<<<< Updated upstream
    // Validate geocoding response
    if (!geocodeResponse.ok || !geocodeData.results.length) {
      throw new Error('Failed to geocode address');
=======
    if (!geocodeResponse.ok || geocodeData.status !== 'OK' || !geocodeData.results || geocodeData.results.length === 0) {
      console.error('Geocoding failed:', geocodeData);
      throw new Error(`Failed to geocode address "${address}". Status: ${geocodeData.status}`);
>>>>>>> Stashed changes
    }

    // Extract coordinates from geocoding response
    const { lat, lng } = geocodeData.results[0].geometry.location;

<<<<<<< Updated upstream
    // Step 2: Fetch solar potential data using coordinates
=======
    // 2. Use latitude and longitude for Solar API
>>>>>>> Stashed changes
    const solarApiUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${solarApiKey}`;
    const solarResponse = await fetch(solarApiUrl);
    // Type the response directly as BuildingInsights
    const buildingInsightsData: BuildingInsights = await solarResponse.json();

<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
    };

    console.log('Structured Data:', JSON.stringify(structuredData, null, 2));

    return structuredData;
<<<<<<< Updated upstream
  } catch (error: unknown) {
    // Handle both Error objects and unknown error types
    if (error instanceof Error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
    // If it's not an Error object, convert it to a string
    throw new Error(`Failed to fetch data: ${String(error)}`);
=======
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
>>>>>>> Stashed changes
  }
}