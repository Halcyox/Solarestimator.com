import { useEffect, useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { InputAdornment } from '@mui/material';
import { AttachMoney } from '@mui/icons-material';

export interface AddressInputProps {
  onSubmit?(inputData: { address: string; bill: number }): void;
  onChange?(inputData: { address: string; bill: number }): void;
  initialAddress?: string;
  initialBill?: number;
}

export const AddressInput = ({ onSubmit, onChange, initialAddress = '', initialBill }: AddressInputProps): JSX.Element => {
  const [bill, setBill] = useState<string>(initialBill?.toString() || '');
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  
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

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    setSelectedAddress(address);
    
    // Notify parent of changes
    if (onChange && bill) {
      onChange({
        address,
        bill: Number(bill),
      });
    }
  };

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

  // Update selected address when initialAddress changes
  useEffect(() => {
    if (initialAddress) {
      setSelectedAddress(initialAddress);
    }
  }, [initialAddress]);

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      if (onSubmit && selectedAddress && bill) {
        onSubmit({
          address: selectedAddress,
          bill: Number(bill),
        });
      }
    }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ position: 'relative' }}>
          <TextField
            fullWidth
            disabled={!ready}
            placeholder="Enter your address"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setSelectedAddress(''); // Clear selected address when user types
            }}
            label="Address"
            required
          />
          {status === "OK" && (
            <Box sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1000,
              mt: 1,
              bgcolor: 'background.paper',
              boxShadow: 3,
              borderRadius: 1,
            }}>
              {data.map(({ place_id, description }) => (
                <Box
                  key={place_id}
                  sx={{
                    p: 1.5,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                  onClick={() => handleSelect(description)}
                >
                  {description}
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <TextField
          type="number"
          label="Monthly Electric Bill"
          value={bill}
          onChange={handleBillChange}
          fullWidth
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoney />
              </InputAdornment>
            ),
          }}
        />

        {onSubmit && (
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            size="large"
            fullWidth
          >
            Continue
          </Button>
        )}
      </Box>
    </form>
  );
};
