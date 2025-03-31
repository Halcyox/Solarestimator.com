import React, { useState, useEffect } from 'react';
import { Grid, Container, Paper, Tabs, Tab, Box } from '@mui/material';
import SystemConfiguration from './SavingsCalculator/SystemConfiguration';
import FinancialInputs from './SavingsCalculator/FinancialInputs';
import EfficiencyFactors from './SavingsCalculator/EfficiencyFactors';
import EnergyUsageProfile from './SavingsCalculator/EnergyUsageProfile';
import CostFactors from './SavingsCalculator/CostFactors';
import ChartDisplay from './SavingsCalculator/ChartDisplay';
import SavingsCalculatorSummary from './SavingsCalculator/SavingsCalculatorSummary';
import TimelineControl from './SavingsCalculator/TimelineControl';
import { SolarData, PanelType, InverterType, FinancingOption } from './SavingsCalculator/types';

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
const MILES_DRIVEN_PER_KWH = 2.24; // EPA average for passenger vehicles

interface SolarData {
  maxArrayPanelsCount: number;
  maxArrayAreaMeters2: number;
  maxSunshineHoursPerYear: number;
  carbonOffsetFactorKgPerMwh: number;
}

interface SavingsCalculatorProps {
  solarData: SolarData;
  bill: number;
  totalEnergyProductionPerYearKwh: number;
  onPanelChange: (value: number) => void;
  onShadingChange: (value: number) => void;
  onTiltChange: (value: number) => void;
}

interface SummaryData {
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

interface RoofSegment {
  tiltAngle: number;
  azimuth: number;
  shadingFactor: number;
  area: number;
}

const SavingsCalculator: React.FC<SavingsCalculatorProps> = ({
  solarData,
  bill,
  totalEnergyProductionPerYearKwh,
  onPanelChange,
  onShadingChange,
  onTiltChange,
}) => {
  // System Configuration State
  const [panelCount, setPanelCount] = useState(4); // Starting with minimum viable system
  const [panelType, setPanelType] = useState<PanelType>('Monocrystalline');
  const [inverterType, setInverterType] = useState<InverterType>('StringInverter');
  const [hasBattery, setHasBattery] = useState(false);

  // Roof Configuration
  const [roofSegments, setRoofSegments] = useState<RoofSegment[]>([
    {
      tiltAngle: 30,
      azimuth: 180, // South-facing
      shadingFactor: 0,
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
  const adjustedMaxPanels = Math.min(maxPossiblePanels, maxPanelsByPower, solarData.maxArrayPanelsCount || 100);

  // Financial Inputs State
  const [financingOption, setFinancingOption] = useState<FinancingOption>('cash');
  const [loanTerm, setLoanTerm] = useState(20);
  const [interestRate, setInterestRate] = useState(4.5);
  const [downPayment, setDownPayment] = useState(0);
  const [incentivePercentage, setIncentivePercentage] = useState(26);

  // Energy Usage Profile State
  const [monthlyBill, setMonthlyBill] = useState(bill);
  const [utilityRate, setUtilityRate] = useState(0.15); // Updated to reflect current average rates

  // Cost Factors State
  const [maintenanceCost, setMaintenanceCost] = useState(200);
  const [inflationRate, setInflationRate] = useState(2.5);
  const [utilityInflationRate, setUtilityInflationRate] = useState(3.5); // Updated to more realistic rate

  // Projection Years State
  const [projectionYears, setProjectionYears] = useState(25);

  // Calculated Results
  const [savingsData, setSavingsData] = useState({
    years: Array.from({ length: 25 }, (_, i) => i + 1),
    cumulativeSavings: Array(25).fill(0),
    cumulativeCosts: Array(25).fill(0),
    monthlyPayments: Array(25).fill(0),
    utilityBills: Array(25).fill(0),
  });

  const [environmentalData, setEnvironmentalData] = useState({
    co2Reduction: Array(25).fill(0),
    treesEquivalent: Array(25).fill(0),
  });

  const [summaryData, setSummaryData] = useState<SummaryData>({
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

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Calculate savings and environmental impact
    console.log('Recalculating with updated parameters:', {
      panelCount,
      panelType,
      inverterType,
      hasBattery,
      financingOption,
      loanTerm,
      interestRate,
      downPayment,
      incentivePercentage,
      monthlyBill,
      utilityRate,
      weightedTiltAngle,
      weightedShadingFactor
    });
    calculateSavings();
  }, [
    panelCount,
    panelType,
    inverterType,
    hasBattery,
    financingOption,
    loanTerm,
    interestRate,
    downPayment,
    incentivePercentage,
    roofSegments,
    monthlyBill,
    utilityRate,
    maintenanceCost,
    inflationRate,
    utilityInflationRate,
    projectionYears,
    weightedTiltAngle,
    weightedShadingFactor
  ]);

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

  const handleBatteryChange = (value: boolean) => {
    setHasBattery(value);
  };

  const calculateSavings = () => {
    console.log('=== Starting Calculations ===');
    
    // Calculate system size and base costs
    const systemSizeKw = panelCount * AVERAGE_PANEL_OUTPUT_KW;
    const panelEfficiency = PANEL_TYPES[panelType].efficiency;
    const baseSystemCost = systemSizeKw * BASE_INSTALLATION_COST_PER_KW * PANEL_TYPES[panelType].costMultiplier;
    
    // Add inverter and battery costs
    const inverterCost = INVERTER_TYPES[inverterType].cost;
    const batteryCost = hasBattery ? BATTERY_COST : 0;
    const totalSystemCost = baseSystemCost + inverterCost + batteryCost;
    
    console.log('System Cost Debug:', {
      panelCount,
      systemSizeKw,
      baseSystemCost,
      inverterCost,
      batteryCost,
      totalSystemCost
    });
    
    // Calculate production with weighted efficiency factors
    const tiltEfficiency = Math.cos((90 - weightedTiltAngle) * Math.PI / 180);
    const shadingEfficiencyFactor = 1 - (weightedShadingFactor / 100);
    
    // Calculate yearly production
    const yearlyProduction = Array(projectionYears).fill(0).map((_, year) => {
      const degradationFactor = Math.pow(1 - PANEL_TYPES[panelType].degradationRate, year);
      const production = systemSizeKw * solarData.maxSunshineHoursPerYear * 
        panelEfficiency * tiltEfficiency * shadingEfficiencyFactor * degradationFactor;
      return production;
    });

    // Calculate total lifetime production for environmental impact
    const totalLifetimeProduction = yearlyProduction.reduce((sum, prod) => sum + prod, 0);
    
    // Calculate environmental impact
    const co2Reduction = totalLifetimeProduction * KG_CO2_PER_KWH;
    const treesEquivalent = co2Reduction / KG_CO2_OFFSET_PER_TREE;
    const gallonsGasSaved = totalLifetimeProduction * GALLONS_GASOLINE_PER_KWH;
    const milesDrivenEquivalent = totalLifetimeProduction * MILES_DRIVEN_PER_KWH;

    console.log('Environmental Impact Debug:', {
      totalLifetimeProduction,
      co2Reduction,
      treesEquivalent,
      gallonsGasSaved,
      milesDrivenEquivalent
    });
    
    // Calculate yearly financial data
    const yearlyData = Array(projectionYears).fill(0).map((_, index) => {
      const utilityInflationMultiplier = Math.pow(1 + utilityInflationRate / 100, index);
      
      // Calculate what utility bill would be without solar
      const utilityBillWithoutSolar = monthlyBill * 12 * utilityInflationMultiplier;
      const monthlyUtilityBill = utilityBillWithoutSolar / 12;
      
      // Calculate solar production value
      const solarProductionValue = yearlyProduction[index] * utilityRate * utilityInflationMultiplier;
      const monthlySolarValue = solarProductionValue / 12;
      
      // Calculate maintenance costs with inflation
      const maintenanceCostForYear = maintenanceCost * Math.pow(1 + inflationRate / 100, index);
      const monthlyMaintenance = maintenanceCostForYear / 12;
      
      // Calculate monthly loan payment or lease payment
      let monthlyPaymentForYear = 0;
      if (financingOption === 'loan') {
        const principal = totalSystemCost * (1 - incentivePercentage / 100) - downPayment;
        const monthlyRate = interestRate / 1200; // Convert annual rate to monthly
        monthlyPaymentForYear = principal > 0 ? (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loanTerm * 12)) : 0;
        
        console.log('Loan Payment Debug:', {
          totalSystemCost,
          incentivePercentage,
          downPayment,
          principal,
          monthlyRate,
          monthlyPaymentForYear
        });
      } else if (financingOption === 'lease') {
        monthlyPaymentForYear = LEASE_COST_PER_YEAR / 12;
      } else if (financingOption === 'cash') {
        // For cash purchase, distribute the cost over the projection period
        const netSystemCost = totalSystemCost * (1 - incentivePercentage / 100);
        monthlyPaymentForYear = netSystemCost / (projectionYears * 12);
      }
      
      // Calculate total monthly costs with solar (payment + maintenance)
      const totalMonthlyCost = monthlyPaymentForYear + monthlyMaintenance;
      
      // Calculate monthly savings (difference between current bill and solar costs)
      const monthlySavings = monthlyBill - totalMonthlyCost;
      
      console.log('Monthly Calculation Debug:', {
        financingOption,
        totalSystemCost,
        monthlyPaymentForYear,
        monthlyMaintenance,
        totalMonthlyCost,
        monthlySavings
      });
      
      return {
        utilityBillWithoutSolar,
        monthlyUtilityBill,
        costs: totalMonthlyCost * 12,
        savings: monthlySavings * 12,
        monthlyPayment: monthlyPaymentForYear,
        monthlyMaintenance,
        monthlySavings
      };
    });

    // Now build cumulative arrays
    const cumulativeSavings: number[] = [];
    const cumulativeCosts: number[] = [];
    let runningCumulativeSavings = 0;
    let runningCumulativeCosts = financingOption === 'cash' ? totalSystemCost : downPayment;

    yearlyData.forEach((yearData, index) => {
      runningCumulativeSavings += yearData.savings;
      runningCumulativeCosts += yearData.costs;
      cumulativeSavings.push(runningCumulativeSavings);
      cumulativeCosts.push(runningCumulativeCosts);
    });

    // Now find breakeven point
    let breakEvenYear = projectionYears;
    let breakEvenMonth = 0;

    for (let index = 0; index < yearlyData.length; index++) {
      if (cumulativeSavings[index] > cumulativeCosts[index] && breakEvenYear === projectionYears) {
        const previousYearSavings = index > 0 ? cumulativeSavings[index - 1] : 0;
        const previousYearCosts = index > 0 ? cumulativeCosts[index - 1] : (financingOption === 'cash' ? totalSystemCost : downPayment);
        const monthlySavings = yearlyData[index].monthlySavings;
        const monthlyCosts = yearlyData[index].costs / 12;

        // Calculate which month within this year breakeven occurs
        let monthlyDifference = previousYearCosts - previousYearSavings;
        for (let month = 1; month <= 12; month++) {
          monthlyDifference += monthlyCosts - monthlySavings;
          if (monthlyDifference <= 0) {
            breakEvenYear = index;
            breakEvenMonth = month;
            break;
          }
        }
      }
    }

    // Calculate monthly values for display
    const monthlyPayments = yearlyData.map(data => data.monthlyPayment + data.monthlyMaintenance);
    const utilityBills = yearlyData.map(data => data.monthlyUtilityBill);

    // Update states
    setSavingsData({
      years: Array.from({ length: projectionYears }, (_, i) => i + 1),
      cumulativeSavings,
      cumulativeCosts,
      monthlyPayments,
      utilityBills,
    });

    const totalLifetimeSavings = Math.max(0, cumulativeSavings[projectionYears - 1] - cumulativeCosts[projectionYears - 1]);

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

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Summary at the top for immediate visibility */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
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
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <ChartDisplay
              years={savingsData.years}
              cumulativeSavings={savingsData.cumulativeSavings}
              cumulativeCosts={savingsData.cumulativeCosts}
              monthlyPayments={savingsData.monthlyPayments}
              utilityBills={savingsData.utilityBills}
            />
          </Paper>
        </Grid>

        {/* Configuration sections in tabs for mobile */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  minWidth: { xs: 'auto', sm: 160 },
                  px: { xs: 2, sm: 3 },
                },
              }}
            >
              <Tab label="System" />
              <Tab label="Timeline" />
              <Tab label="Financial" />
              <Tab label="Efficiency" />
              <Tab label="Costs" />
            </Tabs>
            <Box sx={{ p: 2 }}>
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
                  years={projectionYears}
                  onYearsChange={setProjectionYears}
                />
              )}
              {activeTab === 2 && (
                <FinancialInputs
                  financingOption={financingOption}
                  loanTerm={loanTerm}
                  interestRate={interestRate}
                  downPayment={downPayment}
                  incentivePercentage={incentivePercentage}
                  onFinancingOptionChange={setFinancingOption}
                  onLoanTermChange={setLoanTerm}
                  onInterestRateChange={setInterestRate}
                  onDownPaymentChange={setDownPayment}
                  onIncentivePercentageChange={setIncentivePercentage}
                />
              )}
              {activeTab === 3 && (
                <EfficiencyFactors
                  roofSegments={roofSegments}
                  onRoofSegmentsChange={setRoofSegments}
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
