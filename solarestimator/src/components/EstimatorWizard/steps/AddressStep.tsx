import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { AddressInput } from '../../AddressInput';

interface AddressStepProps {
  data: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    monthlyBill: number | null;
  };
  onUpdate: (updates: Partial<typeof data>) => void;
}

const AddressStep: React.FC<AddressStepProps> = ({ data, onUpdate }) => {
  const handleAddressChange = ({ address, bill }: { address: string; bill: number }) => {
    // First try to extract zip code from the end of the address
    const zipMatch = address.match(/\b\d{5}\b/);
    const zipCode = zipMatch ? zipMatch[0] : '';
    
    // Remove USA from the address for cleaner parsing
    let cleanAddress = address
      .replace(', USA', '')
      .replace(/\s+/g, ' ')
      .trim();

    // If we found a zip code, remove it from the clean address
    if (zipCode) {
      cleanAddress = cleanAddress.replace(zipCode, '').trim().replace(/,\s*$/, '');
    }
    
    // Split the remaining address into parts
    const parts = cleanAddress.split(',').map(part => part.trim());
    
    if (parts.length >= 2) {
      const state = parts[parts.length - 1];
      const city = parts[parts.length - 2];
      const streetAddress = parts.slice(0, parts.length - 2).join(', ');
      
      const updates = {
        address: streetAddress || parts[0], // Fallback to first part if no street address
        city: city,
        state: state,
        zipCode: zipCode,
        monthlyBill: bill
      };
      
      console.log('Clean address:', cleanAddress);
      console.log('Parts:', parts);
      console.log('Updates:', updates);
      console.log('Zip code found:', zipCode);
      
      onUpdate(updates);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
        Where Would You Like Solar Panels?
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <AddressInput 
          initialAddress={data.address ? `${data.address}, ${data.city}, ${data.state} ${data.zipCode}` : ''}
          initialBill={data.monthlyBill || undefined}
          onChange={handleAddressChange}
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }} align="center">
        We'll use your address to calculate solar potential and available incentives
      </Typography>
    </Box>
  );
};

export default AddressStep;
