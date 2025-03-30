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
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
        Solar Investment Summary
      </Typography>
      
      <Grid container spacing={3}>
        {/* Financial Metrics */}
        <SectionTitle title="Financial Impact" />
        <Grid item xs={12} sm={6} md={3}>
          <SummaryItem
            icon={<AttachMoney fontSize="large" />}
            title="Total Lifetime Savings"
            value={formatCurrency(totalSavings)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryItem
            icon={<AccessTime fontSize="large" />}
            title="Payback Period"
            value={formatPaybackPeriod(paybackPeriod)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryItem
            icon={<AttachMoney fontSize="large" />}
            title="Monthly Solar Payment"
            value={formatCurrency(Math.abs(monthlyPayment))}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryItem
            icon={<Savings fontSize="large" />}
            title="Monthly Bill Savings"
            value={formatCurrency(Math.abs(monthlySaving))}
            subtitle="vs Current Bill"
          />
        </Grid>

        {/* System Capacity */}
        <SectionTitle title="System Capacity" />
        <Grid item xs={12} sm={6} md={4}>
          <SummaryItem
            icon={<BoltOutlined fontSize="large" />}
            title="Annual Energy Production"
            value={`${formatLargeNumber(annualKwhProduction)} kWh`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryItem
            icon={<Straighten fontSize="large" />}
            title="Available Roof Area"
            value={`${Math.round(totalRoofArea)} m²`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryItem
            icon={<SolarPower fontSize="large" />}
            title="Solar Panel Capacity"
            value={`${currentPanels} / ${maxPossiblePanels}`}
            subtitle="Current / Maximum"
          />
        </Grid>

        {/* Environmental Impact */}
        <SectionTitle title="Environmental Impact" />
        <Grid item xs={12} sm={6} md={4}>
          <SummaryItem
            icon={<Co2 fontSize="large" />}
            title="CO2 Reduction"
            value={`${formatLargeNumber(co2Reduction)} kg`}
            subtitle={`Equal to ${formatLargeNumber(treesEquivalent)} trees`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryItem
            icon={<LocalGasStation fontSize="large" />}
            title="Gasoline Savings"
            value={`${formatLargeNumber(gallonsGasSaved)} gal`}
            subtitle="Equivalent Savings"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryItem
            icon={<DirectionsCar fontSize="large" />}
            title="Miles Not Driven"
            value={`${formatLargeNumber(milesDrivenEquivalent)} mi`}
            subtitle="Equivalent Impact"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SavingsCalculatorSummary;
