import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { AddressInput } from '../../AddressInput';

/**
 * Interface defining the data structure for the address step form
 * @interface AddressStepProps
 * @property {Object} data - The current address and billing data
 * @property {string} data.address - Street address
 * @property {string} data.city - City name
 * @property {string} data.state - State name
 * @property {string} data.zipCode - ZIP/Postal code
 * @property {number|null} data.monthlyBill - Monthly electricity bill amount
 * @property {function} onUpdate - Callback function to update the form data
 */
interface AddressStepProps {
  data: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    monthlyBill: number | null;
  };
  /**
   * Callback function to update the form data
   * @param {Partial<AddressStepProps['data']>} updates - Partial updates to the form data
   */
  onUpdate: (updates: Partial<AddressStepProps['data']>) => void;
}

/**
 * AddressStep component handles the address collection step in the solar estimator wizard.
 * It provides an interface for users to input their address and monthly electricity bill.
 * The component automatically parses full addresses into individual components (street, city, state, zip).
 * 
 * @component
 * @param {AddressStepProps} props - Component properties
 * @param {Object} props.data - Current address and billing data
 * @param {function} props.onUpdate - Callback to update form data
 * @returns {React.ReactElement} A form for collecting address and billing information
 */
const AddressStep: React.FC<AddressStepProps> = ({ data, onUpdate }) => {
  /**
   * Handles changes to the address input field
   * @param {{ address: string; bill: number }} inputData - New address and bill data
   */
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
        city,
        state,
        zipCode,
        monthlyBill: bill
      };
      
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
          initialBill={data.monthlyBill ?? undefined}
          onChange={handleAddressChange}
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }} align="center">
        We&apos;ll use your address to calculate solar potential and available incentives
      </Typography>
    </Box>
  );
};

export default AddressStep;
