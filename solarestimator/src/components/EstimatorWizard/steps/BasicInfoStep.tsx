import React from 'react';
import {
  Box,
  TextField,
  Typography,
  InputAdornment
} from '@mui/material';
import { Person, Email, Phone } from '@mui/icons-material';
import { PatternFormat } from 'react-number-format';

/**
 * Props interface for the BasicInfoStep component.
 * @interface
 * @property {Object} data - The form data object containing user's basic information
 * @property {string} data.firstName - User's first name
 * @property {string} data.lastName - User's last name
 * @property {string} data.email - User's email address
 * @property {string} data.phone - User's phone number
 * @property {function} onUpdate - Callback function to update the form data
 */
interface BasicInfoStepProps {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  onUpdate: (updates: Partial<BasicInfoStepProps['data']>) => void;
}

/**
 * BasicInfoStep component that renders the first step of the solar estimator wizard.
 * This component collects basic user information including name, email, and phone number.
 * 
 * @component
 * @param {BasicInfoStepProps} props - Component props
 * @param {Object} props.data - The form data object containing user's information
 * @param {function} props.onUpdate - Callback function to update form data
 * @returns {React.ReactElement} A form collecting basic user information
 */
const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, onUpdate }) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
        Let&apos;s Get Started
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            required
            fullWidth
            label="First Name"
            value={data.firstName}
            onChange={(e) => onUpdate({ firstName: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            required
            fullWidth
            label="Last Name"
            value={data.lastName}
            onChange={(e) => onUpdate({ lastName: e.target.value })}
          />
        </Box>

        <TextField
          required
          fullWidth
          label="Email"
          type="email"
          value={data.email}
          onChange={(e) => onUpdate({ email: e.target.value })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            ),
          }}
        />

        <PatternFormat
          format="+1 (###) ###-####"
          customInput={TextField}
          value={data.phone}
          onValueChange={(values) => {
            onUpdate({ phone: values.value });
          }}
          fullWidth
          label="Phone Number (Optional)"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }} align="center">
        We&apos;ll use this information to provide your personalized solar savings estimate
      </Typography>
    </Box>
  );
};

export default BasicInfoStep;
