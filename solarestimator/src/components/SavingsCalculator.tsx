// SavingsCalculator.tsx
import React, { useState, useEffect } from 'react';
import { Grid, Container, Paper, Tabs, Tab, Box, Typography } from '@mui/material';
import { TrendingUp, Settings, Timeline, AttachMoney, Calculate } from '@mui/icons-material';
import SystemConfiguration from './SavingsCalculator/SystemConfiguration';
import FinancialInputs from './SavingsCalculator/FinancialInputs';
import EfficiencyFactors from './SavingsCalculator/EfficiencyFactors';
import EnergyUsageProfile from './SavingsCalculator/EnergyUsageProfile';
import CostFactors from './SavingsCalculator/CostFactors';
import ChartDisplay from './SavingsCalculator/ChartDisplay';
import SavingsCalculatorSummary from './SavingsCalculator/SavingsCalculatorSummary';
import TimelineControl from './SavingsCalculator/TimelineControl';
import { SolarData, PanelType, InverterType } from './SavingsCalculator/types';
import { FinancingOption } from './Wizard';

// Constants
const AVERAGE_PANEL_OUTPUT_KW = 0.4; // Increased to reflect modern panel efficiency
const BASE_INSTALLATION_COST_PER_KW = 2500; // Base installation cost per kW
const PANEL_AREA_M2 = 1.7; // Updated typical solar panel area
const PANEL_TYPES = {
  Monocrystalline: { efficiency: 0.23, degradationRate: 0.005, costMultiplier: 1.2 },
  Polycrystalline: { efficiency: 0.20, degradationRate: 0.006, costMultiplier: 1.0 },
  ThinFilm: { efficiency: 0.18, degradationRate: 0.007, costMultiplier: 0.8 },
};
const INVERTER_TYPES = {
  StringInverter: { cost: 2000 },
  MicroInverter: { cost: 3000 },
};
const BATTERY_COST = 5000; // Battery cost
const LEASE_COST_PER_YEAR = 1000; // Lease cost per year

// Environmental impact constants (updated with more accurate values)
const KG_CO2_PER_KWH = 0.385; // EPA average US grid emissions factor
const KG_CO2_OFFSET_PER_TREE = 21.7; // EPA estimate per urban tree per year
const GALLONS_GASOLINE_PER_KWH = 0.0892; // EPA conversion factor
const MILES_DRIVEN_PER_KWH = 2.24;

interface RoofSegment {
  tiltAngle: number;
  azimuth: number;
  shadingFactor: number;
  area: number;
}

interface SavingsCalculatorProps {
  solarData: SolarData;
  bill: number;
  totalEnergyProductionPerYearKwh: number | null;
  numberOfPanels: number;
  shadingFactor: number;
  tiltFactor: number;
  financingOption: FinancingOption;
  onPanelChange: (value: number) => void;
  onShadingChange: (value: number) => void;
  onTiltChange: (value: number) => void;
  onYearChange: (value: number) => void;
  onFinancingOptionChange?: (option: FinancingOption) => void;
}

const SavingsCalculator: React.FC<SavingsCalculatorProps> = ({
  solarData,
  bill,
  totalEnergyProductionPerYearKwh,
  numberOfPanels,
  shadingFactor,
  tiltFactor,
  financingOption,
  onPanelChange,
  onShadingChange,
  onTiltChange,
  onYearChange,
  onFinancingOptionChange,
}) => {
  // System Configuration State
  const [panelCount, setPanelCount] = useState(numberOfPanels); 
  const [panelType, setPanelType] = useState<PanelType>('Monocrystalline');
  const [inverterType, setInverterType] = useState<InverterType>('StringInverter');
  const [hasBattery, setHasBattery] = useState(false);

  // Roof Configuration
  const [roofSegments, setRoofSegments] = useState<RoofSegment[]>([
    {
      tiltAngle: 30,
      azimuth: 180, // South-facing
      shadingFactor: shadingFactor,
      area: 40, // m²
    }
  ]);

  // Calculate weighted averages for efficiency factors
  const totalArea = roofSegments.reduce((sum, segment) => sum + segment.area, 0);
  const weightedShadingFactor = roofSegments.reduce((sum, segment) => 
    sum + (segment.shadingFactor * segment.area / totalArea), 0);
  const weightedTiltAngle = roofSegments.reduce((sum, segment) => 
    sum + (segment.tiltAngle * segment.area / totalArea), 0);

  // Calculate maximum panels based on available roof area
  const maxPossiblePanels = Math.floor(totalArea / PANEL_AREA_M2);
  const MAX_SYSTEM_SIZE_KW = 30; // Maximum typical residential system size
  const maxPanelsByPower = Math.floor(MAX_SYSTEM_SIZE_KW / AVERAGE_PANEL_OUTPUT_KW);
  const adjustedMaxPanels = Math.min(maxPossiblePanels, maxPanelsByPower, solarData?.maxArrayPanelsCount || 100);

  // Financial Inputs State
  const [loanTerm, setLoanTerm] = useState(20);
  const [interestRate, setInterestRate] = useState(4.5);
  const [downPayment, setDownPayment] = useState(0);
  const [incentivePercentage, setIncentivePercentage] = useState(26);

  // Energy Usage Profile State
  const [monthlyBill, setMonthlyBill] = useState(bill);
  const [annualUsage, setAnnualUsage] = useState(bill * 12);
  const [utilityRate, setUtilityRate] = useState(0.12);

  // Timeline and Projection State
  const [projectionYears, setProjectionYears] = useState(25);
  const [inflationRate, setInflationRate] = useState(2.9);
  const [utilityInflationRate, setUtilityInflationRate] = useState(3.5);
  const [maintenanceCost, setMaintenanceCost] = useState(200);

  // Summary Data State
  const [summaryData, setSummaryData] = useState({
    totalSavings: 0,
    paybackPeriod: 0,
    monthlyPayment: 0,
    monthlySaving: 0,
    co2Reduction: 0,
    treesEquivalent: 0,
    annualKwhProduction: 0,
    totalRoofArea: 0,
    maxPossiblePanels: 0,
    currentPanels: 0,
    gallonsGasSaved: 0,
    milesDrivenEquivalent: 0
  });

  // Chart Data State
  const [savingsData, setSavingsData] = useState({
    years: [] as number[],
    cumulativeSavings: [] as number[],
    cumulativeCosts: [] as number[],
    monthlyPayments: [] as number[],
    utilityBills: [] as number[]
  });

  // Tab State
  const [activeTab, setActiveTab] = useState(0);

  // Handlers
  const handlePanelCountChange = (value: number) => {
    setPanelCount(value);
    onPanelChange(value);
  };

  const handlePanelTypeChange = (type: PanelType) => {
    setPanelType(type);
  };

  const handleInverterTypeChange = (type: InverterType) => {
    setInverterType(type);
  };

  const handleBatteryChange = (hasBattery: boolean) => {
    setHasBattery(hasBattery);
  };

  // Calculate system cost
  const calculateSystemCost = () => {
    const panelCost = panelCount * AVERAGE_PANEL_OUTPUT_KW * BASE_INSTALLATION_COST_PER_KW * PANEL_TYPES[panelType].costMultiplier;
    const inverterCost = INVERTER_TYPES[inverterType].cost;
    const batteryCost = hasBattery ? BATTERY_COST : 0;
    const totalCost = panelCost + inverterCost + batteryCost;
    
    // Apply federal tax credit
    const taxCredit = totalCost * (incentivePercentage / 100);
    return totalCost - taxCredit;
  };

  // Calculate annual energy production
  const calculateAnnualProduction = () => {
    const baseProduction = panelCount * AVERAGE_PANEL_OUTPUT_KW * 8760; // hours per year
    const efficiencyFactor = PANEL_TYPES[panelType].efficiency;
    const shadingFactor = weightedShadingFactor;
    const tiltFactor = Math.cos((weightedTiltAngle - 30) * Math.PI / 180); // Optimal tilt is 30 degrees
    
    return baseProduction * efficiencyFactor * shadingFactor * tiltFactor;
  };

  // Calculate savings over time
  const calculateSavings = () => {
    const systemCost = calculateSystemCost();
    const annualProduction = calculateAnnualProduction();
    const yearlyProduction: number[] = [];
    const yearlyData: any[] = [];
    const years = Array.from({ length: projectionYears }, (_, i) => i + 1);
    
    let cumulativeSavings = 0;
    let cumulativeCosts = systemCost;
    const monthlyPayments: number[] = [];
    const utilityBills: number[] = [];

    years.forEach((year, index) => {
      // Calculate production with degradation
      const degradation = Math.pow(1 - PANEL_TYPES[panelType].degradationRate, year - 1);
      const production = annualProduction * degradation;
      yearlyProduction.push(production);

      // Calculate utility bill without solar
      const utilityBillWithoutSolar = monthlyBill * Math.pow(1 + utilityInflationRate / 100, year - 1);
      utilityBills.push(utilityBillWithoutSolar);

      // Calculate solar payment based on financing option
      let monthlyPayment = 0;
      if (financingOption === 'loan') {
        const loanAmount = systemCost - (systemCost * downPayment / 100);
        const monthlyRate = interestRate / 100 / 12;
        const numPayments = loanTerm * 12;
        monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                        (Math.pow(1 + monthlyRate, numPayments) - 1);
      } else if (financingOption === 'lease') {
        monthlyPayment = LEASE_COST_PER_YEAR / 12;
      }
      monthlyPayments.push(monthlyPayment);

      // Calculate savings
      const annualSavings = (utilityBillWithoutSolar * 12) - (monthlyPayment * 12);
      cumulativeSavings += annualSavings;
      cumulativeCosts += monthlyPayment * 12;

      yearlyData.push({
        year,
        production,
        utilityBill: utilityBillWithoutSolar,
        monthlyPayment,
        monthlyMaintenance: maintenanceCost / 12,
        annualSavings,
        cumulativeSavings,
        cumulativeCosts
      });
    });

    setSavingsData({
      years,
      cumulativeSavings: yearlyData.map(d => d.cumulativeSavings),
      cumulativeCosts: yearlyData.map(d => d.cumulativeCosts),
      monthlyPayments,
      utilityBills
    });

    // Calculate environmental impact
    const totalProduction = yearlyProduction.reduce((sum, prod) => sum + prod, 0);
    const co2Reduction = totalProduction * KG_CO2_PER_KWH;
    const treesEquivalent = co2Reduction / KG_CO2_OFFSET_PER_TREE;
    const gallonsGasSaved = totalProduction * GALLONS_GASOLINE_PER_KWH;
    const milesDrivenEquivalent = totalProduction * MILES_DRIVEN_PER_KWH;

    // Find breakeven point
    let breakEvenYear = 0;
    let breakEvenMonth = 0;
    for (let i = 0; i < yearlyData.length; i++) {
      if (yearlyData[i].cumulativeSavings >= systemCost) {
        breakEvenYear = i + 1;
        const remainingCost = systemCost - (i > 0 ? yearlyData[i - 1].cumulativeSavings : 0);
        breakEvenMonth = Math.ceil(remainingCost / yearlyData[i].annualSavings * 12);
        break;
      }
    }

    const totalLifetimeSavings = yearlyData[yearlyData.length - 1].cumulativeSavings - systemCost;

    setSummaryData({
      totalSavings: totalLifetimeSavings,
      paybackPeriod: breakEvenYear + (breakEvenMonth / 12),
      monthlyPayment: yearlyData[0].monthlyPayment + yearlyData[0].monthlyMaintenance,
      monthlySaving: monthlyBill - (yearlyData[0].monthlyPayment + yearlyData[0].monthlyMaintenance),
      co2Reduction: co2Reduction,
      treesEquivalent: treesEquivalent,
      annualKwhProduction: yearlyProduction[0],
      totalRoofArea: totalArea,
      maxPossiblePanels: adjustedMaxPanels,
      currentPanels: panelCount,
      gallonsGasSaved: gallonsGasSaved,
      milesDrivenEquivalent: milesDrivenEquivalent
    });
  };

  useEffect(() => {
    calculateSavings();
  }, [
    panelCount, panelType, inverterType, hasBattery, financingOption,
    loanTerm, interestRate, downPayment, incentivePercentage,
    monthlyBill, projectionYears, inflationRate, utilityInflationRate, maintenanceCost
  ]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Summary at the top for immediate visibility */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ 
            p: 2, 
            mb: 3,
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderRadius: 3,
            border: '1px solid rgba(226, 232, 240, 0.8)'
          }}>
            <SavingsCalculatorSummary
              totalSavings={summaryData.totalSavings}
              paybackPeriod={summaryData.paybackPeriod}
              monthlyPayment={summaryData.monthlyPayment}
              monthlySaving={summaryData.monthlySaving}
              co2Reduction={summaryData.co2Reduction}
              treesEquivalent={summaryData.treesEquivalent}
              annualKwhProduction={summaryData.annualKwhProduction}
              totalRoofArea={summaryData.totalRoofArea}
              maxPossiblePanels={summaryData.maxPossiblePanels}
              currentPanels={summaryData.currentPanels}
              gallonsGasSaved={summaryData.gallonsGasSaved}
              milesDrivenEquivalent={summaryData.milesDrivenEquivalent}
            />
          </Paper>
        </Grid>

        {/* Chart display */}
        <Grid item xs={12}>
          <ChartDisplay
            years={savingsData.years}
            cumulativeSavings={savingsData.cumulativeSavings}
            cumulativeCosts={savingsData.cumulativeCosts}
            monthlyPayments={savingsData.monthlyPayments}
            utilityBills={savingsData.utilityBills}
          />
        </Grid>

        {/* Configuration sections in tabs for mobile */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ 
            mb: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: 3,
            border: '1px solid rgba(226, 232, 240, 0.8)',
            overflow: 'hidden'
          }}>
            {/* Enhanced Tab Header */}
            <Box sx={{ 
              p: 2,
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              borderBottom: '1px solid rgba(226, 232, 240, 0.8)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Settings sx={{ color: '#3b82f6', fontSize: 24 }} />
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold',
                  color: '#1f2937',
                  fontFamily: 'Inter, system-ui, sans-serif'
                }}>
                  System Configuration
                </Typography>
              </Box>
              
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  '& .MuiTab-root': {
                    minWidth: { xs: 'auto', sm: 160 },
                    px: { xs: 2, sm: 3 },
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    color: '#6b7280',
                    '&.Mui-selected': {
                      color: '#3b82f6',
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: 1,
                    },
                    '&:hover': {
                      color: '#3b82f6',
                      background: 'rgba(59, 130, 246, 0.05)',
                      borderRadius: 1,
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#3b82f6',
                    height: 3,
                    borderRadius: 1.5
                  }
                }}
              >
                <Tab 
                  label="System" 
                  icon={<Settings sx={{ fontSize: 18 }} />}
                  iconPosition="start"
                />
                <Tab 
                  label="Timeline" 
                  icon={<Timeline sx={{ fontSize: 18 }} />}
                  iconPosition="start"
                />
                <Tab 
                  label="Financial" 
                  icon={<AttachMoney sx={{ fontSize: 18 }} />}
                  iconPosition="start"
                />
                <Tab 
                  label="Efficiency" 
                  icon={<TrendingUp sx={{ fontSize: 18 }} />}
                  iconPosition="start"
                />
                <Tab 
                  label="Costs" 
                  icon={<Calculate sx={{ fontSize: 18 }} />}
                  iconPosition="start"
                />
              </Tabs>
            </Box>
            
            <Box sx={{ p: 3 }}>
              {activeTab === 0 && (
                <SystemConfiguration
                  panelCount={panelCount}
                  panelType={panelType}
                  inverterType={inverterType}
                  hasBattery={hasBattery}
                  onPanelCountChange={handlePanelCountChange}
                  onPanelTypeChange={handlePanelTypeChange}
                  onInverterTypeChange={handleInverterTypeChange}
                  onBatteryChange={handleBatteryChange}
                  maxPanels={adjustedMaxPanels}
                />
              )}
              {activeTab === 1 && (
                <TimelineControl
                  timelineYears={projectionYears}
                  maxYears={40}
                  onTimelineChange={setProjectionYears}
                />
              )}
              {activeTab === 2 && (
                <FinancialInputs
                  financingOption={financingOption}
                  loanTerm={loanTerm}
                  interestRate={interestRate}
                  downPayment={downPayment}
                  incentivePercentage={incentivePercentage}
                  onFinancingOptionChange={onFinancingOptionChange ? onFinancingOptionChange : (option) => {
                    // Can't change financing option directly since it's a prop from parent
                    console.log('Financing option change requested:', option);
                  }}
                  onLoanTermChange={setLoanTerm}
                  onInterestRateChange={setInterestRate}
                  onDownPaymentChange={setDownPayment}
                  onIncentivePercentageChange={setIncentivePercentage}
                />
              )}
              {activeTab === 3 && (
                <EfficiencyFactors
                  roofSegments={roofSegments}
                  onShadingChange={onShadingChange}
                  onTiltChange={onTiltChange}
                />
              )}
              {activeTab === 4 && (
                <CostFactors
                  maintenanceCost={maintenanceCost}
                  inflationRate={inflationRate}
                  utilityInflationRate={utilityInflationRate}
                  onMaintenanceCostChange={setMaintenanceCost}
                  onInflationRateChange={setInflationRate}
                  onUtilityInflationRateChange={setUtilityInflationRate}
                />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SavingsCalculator;
