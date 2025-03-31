import React, { useState, useEffect, useCallback } from 'react';
import InputSections from './calculator/InputSections';
import SummarySection from './calculator/SummarySection';
import ChartsSection from './calculator/ChartsSection';
import EnvironmentalImpactSection from './calculator/EnvironmentalImpactSection';
import { SolarData, SavingsCalculatorProps, FinancingOption, PanelType, InverterType } from './calculator/types';

const SavingsCalculator: React.FC<SavingsCalculatorProps> = ({
  solarData,
  bill,
  onPanelChange,
  onShadingChange,
  onTiltChange,
  onYearChange,
}) => {
  // State variables
  const [numberOfPanels, setNumberOfPanels] = useState<number>(Math.min(solarData.maxArrayPanelsCount, 20));
  const [shadingFactor, setShadingFactor] = useState<number>(90); // Start with 90% as percentage
  const [tiltFactor, setTiltFactor] = useState<number>(90); // Start with 90% as percentage
  const [financingOption, setFinancingOption] = useState<FinancingOption>('cash');
  const [numberOfYears, setNumberOfYears] = useState<number>(25);
  const [includeIncentives, setIncludeIncentives] = useState<boolean>(true);
  const [panelType, setPanelType] = useState<PanelType>('Monocrystalline');
  const [inverterType, setInverterType] = useState<InverterType>('String Inverter');
  const [batteryStorage, setBatteryStorage] = useState<boolean>(false);
  const [maintenanceCostPerYear, setMaintenanceCostPerYear] = useState<number>(300);
  const [electricityInflationRate, setElectricityInflationRate] = useState<number>(0.03);
  const [loanInterestRate, setLoanInterestRate] = useState<number>(0.04);
  const [loanTermYears, setLoanTermYears] = useState<number>(10);
  const [federalIncentiveRate, setFederalIncentiveRate] = useState<number>(0.26);
  const [stateIncentiveAmount, setStateIncentiveAmount] = useState<number>(1000);
  const [localIncentiveAmount, setLocalIncentiveAmount] = useState<number>(500);
  const [averageMonthlyConsumption, setAverageMonthlyConsumption] = useState<number>(900);
  const [utilityRate, setUtilityRate] = useState<number>(0.12);
  const [netMeteringPolicy, setNetMeteringPolicy] = useState<string>('Full Net Metering');

  // Constants
  const PANEL_TYPES = {
    Monocrystalline: { efficiency: 1.0, costMultiplier: 1.0, degradationRate: 0.005 },
    Polycrystalline: { efficiency: 0.95, costMultiplier: 0.9, degradationRate: 0.007 },
    'Thin-film': { efficiency: 0.8, costMultiplier: 0.8, degradationRate: 0.01 },
  };

  const INVERTER_TYPES = {
    'String Inverter': { cost: 1000 },
    'Micro Inverter': { cost: 1500 },
    'Power Optimizer': { cost: 2000 },
  };

  const BATTERY_COST = 7000;
  const AVERAGE_PANEL_OUTPUT_KW = 0.3;
  const BASE_INSTALLATION_COST_PER_KW = 2500;
  const LEASE_COST_PER_YEAR = 600;
  const KG_CO2_PER_KWH = 0.475;
  const KG_CO2_OFFSET_PER_TREE = 22;
  const KG_CO2_PER_CAR_PER_YEAR = 4600;

  // Calculations
  const panelSpecs = PANEL_TYPES[panelType];
  const inverterCost = INVERTER_TYPES[inverterType].cost;
  const adjustedPanelOutputKw = AVERAGE_PANEL_OUTPUT_KW * panelSpecs.efficiency;
  const systemSizeKw = numberOfPanels * adjustedPanelOutputKw;
  const baseSystemCost = systemSizeKw * BASE_INSTALLATION_COST_PER_KW * panelSpecs.costMultiplier;
  const totalHardwareCost = baseSystemCost + inverterCost + (batteryStorage ? BATTERY_COST : 0);
  const totalSystemCost = totalHardwareCost;

  // Incentives and Rebates
  const federalIncentive = includeIncentives ? totalSystemCost * federalIncentiveRate : 0;
  const stateIncentive = includeIncentives ? stateIncentiveAmount : 0;
  const localIncentive = includeIncentives ? localIncentiveAmount : 0;
  const totalIncentives = federalIncentive + stateIncentive + localIncentive;
  const netSystemCost = totalSystemCost - totalIncentives;

  // Convert shading and tilt factors from percentages to decimal fractions
  const adjustedShadingFactor = shadingFactor / 100;
  const adjustedTiltFactor = tiltFactor / 100;

  // Energy Production with Degradation
  const SPECIFIC_YIELD = 1500; // kWh per kW per year (adjust based on location)
  const annualEnergyProduction = Array.from({ length: numberOfYears }, (_, year) => {
    const degradationFactor = Math.pow(1 - panelSpecs.degradationRate, year);
    return systemSizeKw * SPECIFIC_YIELD * adjustedShadingFactor * adjustedTiltFactor * degradationFactor;
  });

  // Annual Savings with Electricity Inflation and Net Metering
  const annualSavings = annualEnergyProduction.map((production, year) => {
    const inflatedRate = utilityRate * Math.pow(1 + electricityInflationRate, year);
    let savings = production * inflatedRate;
    if (netMeteringPolicy === 'No Net Metering') {
      savings *= 0.6;
    } else if (netMeteringPolicy === 'Partial Net Metering') {
      savings *= 0.8;
    }
    return savings;
  });

  // Cumulative Savings and Costs
  const cumulativeSavings = annualSavings.reduce((acc, value, index) => {
    acc.push((acc[index - 1] || 0) + value);
    return acc;
  }, [] as number[]);

  const annualCosts = Array.from({ length: numberOfYears }, (_, year) => {
    let cost = 0;
    if (financingOption === 'lease') {
      cost += LEASE_COST_PER_YEAR;
    } else if (financingOption === 'loan' && year < loanTermYears) {
      const monthlyInterestRate = loanInterestRate / 12;
      const totalLoanPayments = loanTermYears * 12;
      const monthlyLoanPayment = (netSystemCost * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -totalLoanPayments));
      cost += monthlyLoanPayment * 12;
    } else if (financingOption === 'cash' && year === 0) {
      cost += netSystemCost;
    }
    cost += maintenanceCostPerYear;
    return cost;
  });

  const cumulativeCosts = annualCosts.reduce((acc, value, index) => {
    acc.push((acc[index - 1] || 0) + value);
    return acc;
  }, [] as number[]);

  // Payback Period and ROI Calculation
  const paybackPeriodIndex = cumulativeSavings.findIndex((savings, index) => savings >= cumulativeCosts[index]);
  const paybackPeriod = paybackPeriodIndex !== -1 ? paybackPeriodIndex + 1 : 'N/A';
  const totalSavings = cumulativeSavings[cumulativeSavings.length - 1];
  const roi = ((totalSavings - cumulativeCosts[cumulativeCosts.length - 1]) / netSystemCost) * 100;

  // Environmental Impact Calculations
  const annualCO2OffsetKg = annualEnergyProduction.map((production) => production * KG_CO2_PER_KWH);
  const totalCO2OffsetKg = annualCO2OffsetKg.reduce((sum, value) => sum + value, 0);
  const treesPlantedEquivalent = totalCO2OffsetKg / KG_CO2_OFFSET_PER_TREE;
  const carsRemoved = totalCO2OffsetKg / (KG_CO2_PER_CAR_PER_YEAR * numberOfYears);

  // Chart Data
  const years = Array.from({ length: numberOfYears }, (_, i) => i + 1);
  const lineChartData = {
    labels: years.map((year) => `Year ${year}`),
    datasets: [
      {
        label: 'Cumulative Savings ($)',
        data: cumulativeSavings,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Cumulative Costs ($)',
        data: cumulativeCosts,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const barChartData = {
    labels: ['Total Savings', 'Total Costs'],
    datasets: [
      {
        label: 'Financial Summary',
        data: [totalSavings, cumulativeCosts[cumulativeCosts.length - 1]],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  const pieChartData = {
    labels: ['CO₂ Offset (kg)', 'Equivalent Trees Planted'],
    datasets: [
      {
        data: [totalCO2OffsetKg, treesPlantedEquivalent],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
      },
    ],
  };

  // Handlers
  const handlePanelChange = useCallback((value: number) => {
    setNumberOfPanels(value);
    onPanelChange(value);
  }, [onPanelChange]);

  const handleShadingChange = useCallback((value: number) => {
    setShadingFactor(value);
    onShadingChange(value);
  }, [onShadingChange]);

  const handleTiltChange = useCallback((value: number) => {
    setTiltFactor(value);
    onTiltChange(value);
  }, [onTiltChange]);

  const handleYearsChange = (value: number) => {
    setNumberOfYears(value);
    onYearChange(value); // Update the parent component state
  };

  return (
    <div className="savings-calculator">
      <SummarySection
        solarData={solarData}
        bill={bill}
        totalSystemCost={totalSystemCost}
        totalIncentives={totalIncentives}
        annualSavings={annualSavings}
        totalSavingsOverYears={totalSavings}
        paybackPeriod={paybackPeriod}
        roi={roi}
      />

      <InputSections
        solarData={solarData}
        onPanelChange={handlePanelChange}
        onShadingChange={handleShadingChange}
        onTiltChange={handleTiltChange}
        shadingFactor={shadingFactor}
        tiltFactor={tiltFactor}
      />

      <div className="timescale-slider">
        <label>
          Number of Years: {numberOfYears}
          <input
            type="range"
            min="1"
            max="30"
            value={numberOfYears}
            onChange={(e) => handleYearsChange(Number(e.target.value))}
          />
        </label>
      </div>

      <ChartsSection
        lineChartData={lineChartData}
        barChartData={barChartData}
        pieChartData={pieChartData}
      />

      <EnvironmentalImpactSection
        energyProductionKwh={annualEnergyProduction.reduce((a, b) => a + b, 0)}
        years={numberOfYears}
        region="USA"
      />

      <div className="visualizations">
        <h3>Solar Panel Layout Visualization (Coming Soon)</h3>
        <p>A visual representation of the solar panel layout on your property will be displayed here.</p>
      </div>
    </div>
  );
};

export default SavingsCalculator;
