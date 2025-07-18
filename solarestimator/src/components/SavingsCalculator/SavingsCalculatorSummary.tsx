import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { 
  AttachMoney, 
  AccessTime, 
  Savings, 
  Co2, 
  Park, 
  BoltOutlined,
  Straighten,
  SolarPower,
  LocalGasStation,
  DirectionsCar
} from '@mui/icons-material';

interface SavingsCalculatorSummaryProps {
  totalSavings: number;
  paybackPeriod: number;
  monthlyPayment: number;
  monthlySaving: number;
  co2Reduction: number;
  treesEquivalent: number;
  annualKwhProduction: number;
  totalRoofArea: number;
  maxPossiblePanels: number;
  currentPanels: number;
  gallonsGasSaved: number;
  milesDrivenEquivalent: number;
}

/**
 * Formats a decimal year value into a human-readable string of years and months.
 * @param years - The number of years (can include decimal portions)
 * @returns A formatted string like "2 years, 6 months" or "6 months" or "2 years"
 */
const formatPaybackPeriod = (years: number) => {
  const wholeYears = Math.floor(years);
  const months = Math.round((years - wholeYears) * 12);
  
  if (months === 0) {
    return `${wholeYears} years`;
  } else if (wholeYears === 0) {
    return `${months} months`;
  } else {
    return `${wholeYears} years, ${months} months`;
  }
};

/**
 * Formats large numbers into a more readable format with K (thousands) or M (millions) suffix.
 * @param num - The number to format
 * @returns A formatted string with appropriate suffix (e.g., "1.2M" or "500K")
 */
const formatLargeNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toFixed(0);
};

/**
 * Formats currency values into a more readable format with K (thousands) or M (millions) suffix.
 * @param amount - The monetary amount to format
 * @returns A formatted string with dollar sign and appropriate suffix (e.g., "$1.2M" or "$500K")
 */
const formatCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return `$${amount.toFixed(0)}`;
};

/**
 * A reusable component that displays a summary statistic with an icon, title, and value.
 * @param props - Component props
 * @param props.icon - The Material-UI icon to display
 * @param props.title - The title text for the statistic
 * @param props.value - The value to display
 * @param props.subtitle - Optional subtitle text to display below the value
 */
const SummaryItem = ({ 
  icon, 
  title, 
  value, 
  subtitle 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  subtitle?: string 
}) => (
  <Box 
    sx={{ 
      textAlign: 'center', 
      p: 1.5,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 0.5
    }}
  >
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: 'primary.main',
      mb: 0.5
    }}>
      {React.cloneElement(icon as React.ReactElement, { sx: { fontSize: '1.5rem' } })}
    </Box>
    <Typography 
      variant="body2" 
      color="text.secondary" 
      sx={{ 
        minHeight: '2em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        lineHeight: 1.1,
        fontSize: '0.75rem'
      }}
    >
      {title}
    </Typography>
    <Typography 
      variant="h6" 
      component="div" 
      sx={{ 
        fontWeight: 'bold',
        fontSize: '1rem',
        lineHeight: 1.1,
        wordBreak: 'break-all',
        whiteSpace: 'normal',
        maxWidth: '100%'
      }}
    >
      {value}
    </Typography>
    {subtitle && (
      <Typography 
        variant="caption" 
        color="text.secondary"
        sx={{
          mt: 0.25,
          fontSize: '0.7rem',
          lineHeight: 1.1,
          textAlign: 'center'
        }}
      >
        {subtitle}
      </Typography>
    )}
  </Box>
);

/**
 * A simple section title component for grouping summary items.
 * @param props - Component props
 * @param props.title - The title text to display
 */
const SectionTitle = ({ title }: { title: string }) => (
  <Grid item xs={12}>
    <Typography 
      variant="h6" 
      sx={{ 
        mt: 3, 
        mb: 2, 
        borderBottom: '2px solid',
        borderColor: 'primary.main',
        paddingBottom: 1
      }}
    >
      {title}
    </Typography>
  </Grid>
);

/**
 * The main summary component that displays various solar installation statistics and savings calculations.
 * This component presents key metrics about the solar installation including financial benefits,
 * environmental impact, and system specifications in an organized grid layout.
 * 
 * @param props - Component props
 * @param props.totalSavings - Total lifetime savings in dollars
 * @param props.paybackPeriod - Time in years until the system pays for itself
 * @param props.monthlyPayment - Monthly payment for the solar system
 * @param props.monthlySaving - Monthly savings on energy bills
 * @param props.co2Reduction - Annual CO2 emissions reduction in pounds
 * @param props.treesEquivalent - Number of trees equivalent to the CO2 reduction
 * @param props.annualKwhProduction - Annual electricity production in kWh
 * @param props.totalRoofArea - Total available roof area in square feet
 * @param props.maxPossiblePanels - Maximum number of panels that can fit
 * @param props.currentPanels - Number of panels in current design
 * @param props.gallonsGasSaved - Equivalent gallons of gas saved
 * @param props.milesDrivenEquivalent - Equivalent miles driven in terms of emissions
 */
const SavingsCalculatorSummary: React.FC<SavingsCalculatorSummaryProps> = ({
  totalSavings,
  paybackPeriod,
  monthlyPayment,
  monthlySaving,
  co2Reduction,
  treesEquivalent,
  annualKwhProduction,
  totalRoofArea,
  maxPossiblePanels,
  currentPanels,
  gallonsGasSaved,
  milesDrivenEquivalent,
}) => {
  return (
    <Box sx={{ 
      width: '100%', 
      p: 1,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: 2,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.2)'
    }}>
      <Typography variant="h6" sx={{ 
        mb: 1, 
        textAlign: 'center', 
        fontWeight: 'bold',
        color: 'white',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
      }}>
        Solar Investment Summary
      </Typography>
      
      <Grid container spacing={0.5}>
        {/* Primary Financial Metrics - Most Important */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ 
            color: 'white', 
            fontWeight: 'bold', 
            mb: 0.5,
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}>
            💰 Your Savings
          </Typography>
        </Grid>
        
        {/* Monthly Impact - What you'll see immediately */}
        <Grid item xs={6}>
          <Box sx={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 1,
            p: 1,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <Savings sx={{ color: '#4CAF50', fontSize: '1.2rem', mb: 0.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
              {formatCurrency(Math.max(0, monthlySaving))}
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              Monthly Savings
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 1,
            p: 1,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <AttachMoney sx={{ color: '#2196F3', fontSize: '1.2rem', mb: 0.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1565C0' }}>
              {formatCurrency(Math.abs(monthlyPayment))}
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              Monthly Payment
            </Typography>
          </Box>
        </Grid>
        
        {/* Long-term Impact */}
        <Grid item xs={6}>
          <Box sx={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 1,
            p: 1,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <AttachMoney sx={{ color: '#4CAF50', fontSize: '1.2rem', mb: 0.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
              {formatCurrency(Math.max(0, totalSavings))}
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              25-Year Savings
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 1,
            p: 1,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <AccessTime sx={{ color: '#FF9800', fontSize: '1.2rem', mb: 0.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#E65100' }}>
              {formatPaybackPeriod(paybackPeriod)}
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              Payback Time
            </Typography>
          </Box>
        </Grid>
        
        {/* System Performance */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ 
            color: 'white', 
            fontWeight: 'bold', 
            mb: 0.5,
            mt: 1,
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}>
            ⚡ System Performance
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 1,
            p: 1,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <BoltOutlined sx={{ color: '#FFC107', fontSize: '1.2rem', mb: 0.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#F57F17' }}>
              {formatLargeNumber(annualKwhProduction)} kWh
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              Annual Production
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 1,
            p: 1,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <SolarPower sx={{ color: '#FF9800', fontSize: '1.2rem', mb: 0.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#E65100' }}>
              {currentPanels} / {maxPossiblePanels}
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              Panels Used
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 1,
            p: 1,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <Straighten sx={{ color: '#9C27B0', fontSize: '1.2rem', mb: 0.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6A1B9A' }}>
              {Math.round(totalRoofArea)} m²
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              Roof Space
            </Typography>
          </Box>
        </Grid>
        
        {/* Environmental Impact */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ 
            color: 'white', 
            fontWeight: 'bold', 
            mb: 0.5,
            mt: 1,
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}>
            🌱 Environmental Impact
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 1,
            p: 1,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <Co2 sx={{ color: '#4CAF50', fontSize: '1.2rem', mb: 0.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
              {Math.round(co2Reduction)} kg
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              CO2 Reduced
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 1,
            p: 1,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <LocalGasStation sx={{ color: '#FF5722', fontSize: '1.2rem', mb: 0.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#D84315' }}>
              {Math.round(gallonsGasSaved)} gal
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              Gas Saved
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 1,
            p: 1,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <DirectionsCar sx={{ color: '#607D8B', fontSize: '1.2rem', mb: 0.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#37474F' }}>
              {Math.round(milesDrivenEquivalent / 10) / 100}k mi
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              Miles Offset
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SavingsCalculatorSummary;
