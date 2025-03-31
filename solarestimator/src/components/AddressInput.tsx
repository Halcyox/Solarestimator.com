import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
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
 * Props interface for the AddressInput component
 * @interface AddressInputProps
 * @property {function} [onSubmit] - Optional callback function called when form is submitted
 * @property {function} [onChange] - Optional callback function called when either address or bill changes
 * @property {string} [initialAddress] - Optional initial address value
 * @property {number} [initialBill] - Optional initial monthly bill value
 */
export interface AddressInputProps {
  /**
   * Callback function called when the form is submitted.
   * It receives an object with the selected address and bill amount.
   */
  onSubmit?(inputData: { address: string; bill: number }): void;
  /**
   * Callback function called when either the address or bill input changes.
   * It receives an object with the current address and bill amount.
   */
  onChange?(inputData: { address: string; bill: number }): void;
  /**
   * Optional initial address value.
   */
  initialAddress?: string;
  /**
   * Optional initial monthly bill value.
   */
  initialBill?: number;
}

/**
 * AddressInput Component
 * 
 * A form component that combines Google Places Autocomplete for address input
 * and a numeric input for electric bill amount. It provides address validation
 * through Google Places API and ensures the address is selected from the
 * autocomplete suggestions before submission.
 * 
 * Features:
 * - Google Places Autocomplete integration
 * - Address validation through geocoding
 * - Monthly bill input with currency formatting
 * - Form validation and error handling
 * - Controlled component with optional external state management
 * 
 * @component
 * @param {AddressInputProps} props - Component props
 * @param {function} [props.onSubmit] - Callback when form is submitted
 * @param {function} [props.onChange] - Callback when inputs change
 * @param {string} [props.initialAddress] - Initial address value
 * @param {number} [props.initialBill] - Initial bill amount
 * @returns {JSX.Element} Rendered form component
 * 
 * @example
 * ```tsx
 * <AddressInput 
 *   onSubmit={({address, bill}) => {
 *     console.log('Selected address:', address);
 *     console.log('Electric bill:', bill);
 *   }}
 *   initialAddress="123 Main St"
 *   initialBill={150}
 * />
 * ```
 */
export const AddressInput = ({ onSubmit, onChange, initialAddress = '', initialBill }: AddressInputProps): JSX.Element => {
  /**
   * State variable to store the current bill amount.
   */
  const [bill, setBill] = useState<string>(initialBill?.toString() || '');
  /**
   * State variable to store the currently selected address.
   */
  const [selectedAddress, setSelectedAddress] = useState<string>(initialAddress);
  
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
    setValue(address, false);
    clearSuggestions();
    setSelectedAddress(address);
    
    try {
      // Attempt to geocode the address to validate it
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      
      // Only notify parent of changes if geocoding was successful
      if (onChange && bill) {
        onChange({
          address,
          bill: Number(bill),
        });
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      // You might want to show an error message to the user here
    }
  };

  /**
   * Handler function for when the bill input changes.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input event.
   */
  const handleBillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBill = e.target.value;
    setBill(newBill);
    
    // Only notify if we have both a selected address and a bill
    if (onChange && selectedAddress && newBill) {
      onChange({
        address: selectedAddress,
        bill: Number(newBill),
      });
    }
  };

  /**
   * Handler function for form submission.
   * @param {React.FormEvent<HTMLFormElement>} e - The form event.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedAddress) {
      console.error('No address selected');
      return;
    }
    
    if (!bill) {
      console.error('No bill amount entered');
      return;
    }
    
    if (onSubmit) {
      onSubmit({
        address: selectedAddress,
        bill: Number(bill),
      });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
      }}
    >
      <TextField
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        disabled={!ready}
        label="Enter your address"
        fullWidth
        variant="outlined"
        placeholder="123 Main St, City, State"
        InputProps={{
          sx: { borderRadius: 2 },
        }}
      />
      
      {/* Render the autocomplete suggestions */}
      {status === 'OK' && (
        <Box
          sx={{
            mt: -1,
            mb: 2,
            maxHeight: '200px',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 3,
          }}
        >
          {data.map((suggestion: PlaceSuggestion) => (
            <Box
              key={suggestion.place_id}
              onClick={() => handleSelect(suggestion.description)}
              sx={{
                px: 2,
                py: 1,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Box sx={{ fontWeight: 'bold' }}>{suggestion.structured_formatting.main_text}</Box>
              <Box sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                {suggestion.structured_formatting.secondary_text}
              </Box>
            </Box>
          ))}
        </Box>
      )}
      
      <TextField
        value={bill}
        onChange={handleBillChange}
        label="Monthly Electric Bill"
        type="number"
        fullWidth
        variant="outlined"
        placeholder="150"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AttachMoneyIcon />
            </InputAdornment>
          ),
          sx: { borderRadius: 2 },
        }}
      />
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{
          mt: 2,
          py: 1.5,
          borderRadius: 2,
          fontWeight: 'bold',
        }}
        disabled={!selectedAddress || !bill}
      >
        Calculate Savings
      </Button>
    </Box>
  );
};
