import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

/**
 * Type declaration for Google Maps Places API
 * This extends the global Window interface to include Google Maps types
 * required for the Places Autocomplete functionality
 */
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            opts?: google.maps.places.AutocompleteOptions
          ) => google.maps.places.Autocomplete;
        };
      };
    };
  }
}

/**
 * Interface representing a place suggestion from Google Places API
 * @interface PlaceSuggestion
 * @property {string} place_id - Unique identifier for the place
 * @property {string} description - Full text description of the place
 * @property {Object} structured_formatting - Formatted address components
 * @property {string} structured_formatting.main_text - Primary text (usually street address)
 * @property {string} structured_formatting.secondary_text - Secondary text (usually city, state)
 */
interface PlaceSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

/**
 * Props interface for the AddressInput component (Wizard version)
 * @interface AddressInputProps
 * @property {function} [onAddressSelect] - Callback function called specifically when an address is selected from suggestions.
 * @property {string} [initialAddress] - Optional initial address value
 */
export interface AddressInputProps {
  /**
   * Optional callback function called specifically when an address is selected from suggestions.
   * It receives the selected address string or null if cleared.
   */
  onAddressSelect?(selectedAddress: string | null): void;
  /**
   * Optional initial address value.
   */
  initialAddress?: string;
}

/**
 * AddressInput Component (Wizard version)
 * 
 * A component that uses Google Places Autocomplete for address input.
 * It validates the address through Google Places API.
 * 
 * Features:
 * - Google Places Autocomplete integration
 * - Address validation through geocoding
 * - Controlled component with callback for address selection
 * 
 * @component
 * @param {AddressInputProps} props - Component props
 * @param {function} [props.onAddressSelect] - Callback when an address is selected
 * @param {string} [props.initialAddress] - Initial address value
 * @returns {JSX.Element} Rendered address input component
 * 
 * @example
 * ```tsx
 * <AddressInput 
 *   onAddressSelect={(address) => {
 *     console.log('Selected address:', address);
 *   }}
 *   initialAddress="123 Main St"
 * />
 * ```
 */
export const AddressInput = ({ onAddressSelect, initialAddress = '' }: AddressInputProps): JSX.Element => {
  /**
   * State variable to store the currently selected address internally for validation.
   */
  const [selectedAddressValidated, setSelectedAddressValidated] = useState<boolean>(!!initialAddress);
  
  /**
   * Hook to manage the Places Autocomplete functionality.
   */
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'us' },
      types: ['address'],
    },
    defaultValue: initialAddress,
    debounce: 300, // Add slight debounce
  });

  /**
   * Effect hook to validate the Google Maps API key.
   */
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      console.error('Google Maps API key is not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file.');
    }
  }, []);

  /**
   * Handler function for when an address is selected from the autocomplete suggestions.
   * @param {string} address - The selected address.
   */
  const handleSelect = async (address: string) => {
    setValue(address, false); // Update the input field value
    clearSuggestions();
    setSelectedAddressValidated(false); // Assume invalid until geocoded
    
    try {
      // Attempt to geocode the address to validate it
      const results = await getGeocode({ address });
      if (results && results.length > 0) {
        const { lat, lng } = await getLatLng(results[0]);
        console.log(`Geocoded Address: ${address}, Lat: ${lat}, Lng: ${lng}`);
        setSelectedAddressValidated(true);
        // Only notify parent if geocoding was successful
        if (onAddressSelect) {
          onAddressSelect(address);
        }
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      // Address is invalid, notify parent with null
      if (onAddressSelect) {
        onAddressSelect(null);
      }
      // Optionally: show an error message to the user here
    }
  };

  // Handle manual input changes - clear validated status and notify parent with null
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      setSelectedAddressValidated(false);
      if (onAddressSelect) {
          onAddressSelect(null); // Address is not confirmed from dropdown
      }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1, // Reduced gap as bill input is removed
        width: '100%',
        position: 'relative', // Needed for suggestion box positioning
      }}
    >
      <TextField
        value={value}
        onChange={handleInputChange} // Use custom handler
        disabled={!ready}
        label="Enter property address"
        fullWidth
        variant="outlined"
        placeholder="123 Main St, City, State"
        InputProps={{
          sx: { borderRadius: 1 },
        }}
        required // Make address field required visually
      />
      
      {/* Render the autocomplete suggestions */}
      {status === 'OK' && data.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%', // Position below the input field
            left: 0,
            right: 0,
            zIndex: 10, // Ensure suggestions are on top
            mt: 0.5,
            maxHeight: '200px',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {data.map((suggestion: PlaceSuggestion) => (
            <Box
              key={suggestion.place_id}
              onClick={() => handleSelect(suggestion.description)}
              sx={{
                px: 2,
                py: 1.5, // Slightly more padding
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': {
                  borderBottom: 'none',
                },
              }}
            >
              <Box sx={{ fontWeight: 'medium', color: 'text.primary' }}>{suggestion.structured_formatting.main_text}</Box>
              <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                {suggestion.structured_formatting.secondary_text}
              </Box>
            </Box>
          ))}
        </Box>
      )}
      
      {/* Removed Bill TextField */}
      
      {/* Removed Submit Button */}
    </Box>
  );
};
