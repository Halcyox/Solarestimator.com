import React, { useState, useCallback } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  ChartTitle,
  Tooltip,
  Legend
);

interface SolarData {
  maxArrayPanelsCount: number;
  maxArrayAreaMeters2: number;
  maxSunshineHoursPerYear: number;
  carbonOffsetFactorKgPerMwh: number;
}

interface SavingsCalculatorProps {
  solarData: SolarData;
  bill: number;
  onPanelChange: (value: number) => void;
  onShadingChange: (value: number) => void;
  onTiltChange: (value: number) => void;
}

type FinancingOption = 'cash' | 'loan' | 'lease';

type PanelType = 'Monocrystalline' | 'Polycrystalline' | 'Thin-film';

const SavingsCalculator: React.FC<SavingsCalculatorProps> = ({
  solarData,
  bill,
  onPanelChange,
  onShadingChange,
  onTiltChange,
}) => {
  // State variables
  const [numberOfPanels, setNumberOfPanels] = useState<number>(
    Math.min(solarData.maxArrayPanelsCount, 20)
  );
  const [shadingFactor, setShadingFactor] = useState<number>(0.9); // 90% efficiency
  const [tiltFactor, setTiltFactor] = useState<number>(0.9); // 90% efficiency
  const [financingOption, setFinancingOption] = useState<FinancingOption>('cash');
  const [numberOfYears, setNumberOfYears] = useState<number>(25); // 25 years
  const [includeIncentives, setIncludeIncentives] = useState<boolean>(true);
  const [panelType, setPanelType] = useState<PanelType>('Monocrystalline');
  const [inverterType, setInverterType] = useState<string>('String Inverter');
  const [batteryStorage, setBatteryStorage] = useState<boolean>(false);
  const [maintenanceCostPerYear, setMaintenanceCostPerYear] = useState<number>(300);
  const [electricityInflationRate, setElectricityInflationRate] = useState<number>(0.03); // 3%
  const [loanInterestRate, setLoanInterestRate] = useState<number>(0.04); // 4%
  const [loanTermYears, setLoanTermYears] = useState<number>(10); // 10 years
  const [federalIncentiveRate, setFederalIncentiveRate] = useState<number>(0.26); // 26%
  const [stateIncentiveAmount, setStateIncentiveAmount] = useState<number>(1000); // $1000
  const [localIncentiveAmount, setLocalIncentiveAmount] = useState<number>(500); // $500
  const [averageMonthlyConsumption, setAverageMonthlyConsumption] = useState<number>(900); // kWh
  const [utilityRate, setUtilityRate] = useState<number>(0.12); // $0.12 per kWh
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

  const BATTERY_COST = 7000; // $7000 for battery storage

  const AVERAGE_PANEL_OUTPUT_KW = 0.3; // 300 watts per panel
  const BASE_INSTALLATION_COST_PER_KW = 2500; // $2500 per kW
  const LEASE_COST_PER_YEAR = 600; // $600 per year for leasing
  const KG_CO2_PER_KWH = 0.475; // Environmental impact factor
  const KG_CO2_OFFSET_PER_TREE = 22; // CO2 offset per tree per year

  // Adjusted variables
  const maxPanels = Math.min(solarData.maxArrayPanelsCount, 50); // Max 50 panels

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

  // Energy Production with Degradation
  const annualEnergyProduction = Array.from({ length: numberOfYears }, (_, year) => {
    const degradationFactor = Math.pow(1 - panelSpecs.degradationRate, year);
    return (
      systemSizeKw *
      solarData.maxSunshineHoursPerYear *
      shadingFactor *
      tiltFactor *
      degradationFactor
    );
  });

  // Annual Savings with Electricity Inflation and Net Metering
  const annualSavings = annualEnergyProduction.map((production, year) => {
    const inflatedRate = utilityRate * Math.pow(1 + electricityInflationRate, year);
    let savings = production * inflatedRate;

    // Adjust savings based on net metering policy
    if (netMeteringPolicy === 'No Net Metering') {
      savings *= 0.6; // Assume 60% of energy is used on-site
    } else if (netMeteringPolicy === 'Partial Net Metering') {
      savings *= 0.8; // Assume 80% of energy is credited
    }
    return savings;
  });

  // Cumulative Savings and Costs
  const cumulativeSavings = annualSavings.reduce<number[]>((acc, value, index) => {
    acc.push((acc[index - 1] || 0) + value);
    return acc;
  }, []);

  const annualCosts = Array.from({ length: numberOfYears }, (_, year) => {
    let cost = 0;
    if (financingOption === 'lease') {
      cost += LEASE_COST_PER_YEAR;
    } else if (financingOption === 'loan' && year < loanTermYears) {
      const monthlyInterestRate = loanInterestRate / 12;
      const totalLoanPayments = loanTermYears * 12;
      const monthlyLoanPayment =
        (netSystemCost * monthlyInterestRate) /
        (1 - Math.pow(1 + monthlyInterestRate, -totalLoanPayments));
      cost += monthlyLoanPayment * 12;
    } else if (financingOption === 'cash' && year === 0) {
      cost += netSystemCost;
    }
    cost += maintenanceCostPerYear;
    return cost;
  });

  const cumulativeCosts = annualCosts.reduce<number[]>((acc, value, index) => {
    acc.push((acc[index - 1] || 0) + value);
    return acc;
  }, []);

  // Payback Period Calculation
  const paybackPeriodIndex = cumulativeSavings.findIndex(
    (savings, index) => savings >= cumulativeCosts[index]
  );
  const paybackPeriod = paybackPeriodIndex !== -1 ? paybackPeriodIndex + 1 : 'N/A';

  // ROI Calculation
  const totalSavings = cumulativeSavings[cumulativeSavings.length - 1];
  const roi = ((totalSavings - cumulativeCosts[cumulativeCosts.length - 1]) / netSystemCost) * 100;

  // Monthly Costs and Savings
  const monthlySavings = annualSavings[0] / 12;
  const monthlyCost =
    financingOption === 'loan'
      ? ((netSystemCost * (loanInterestRate / 12)) /
          (1 - Math.pow(1 + loanInterestRate / 12, -loanTermYears * 12))) +
        maintenanceCostPerYear / 12
      : financingOption === 'lease'
      ? LEASE_COST_PER_YEAR / 12 + maintenanceCostPerYear / 12
      : maintenanceCostPerYear / 12;

  // Environmental Impact Calculations
  const annualCO2OffsetKg = annualEnergyProduction.map(
    (production) => production * KG_CO2_PER_KWH
  );

  const cumulativeCO2OffsetKg = annualCO2OffsetKg.reduce<number[]>((acc, value, index) => {
    acc.push((acc[index - 1] || 0) + value);
    return acc;
  }, []);

  const totalCO2OffsetKg = cumulativeCO2OffsetKg[cumulativeCO2OffsetKg.length - 1];
  const treesPlantedEquivalent = totalCO2OffsetKg / KG_CO2_OFFSET_PER_TREE;

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

  // Event Handlers
  const handlePanelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const panels = Number(e.target.value);
      setNumberOfPanels(panels);
      onPanelChange(panels);
    },
    [onPanelChange]
  );

  const handleShadingChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const shading = Number(e.target.value);
      setShadingFactor(shading);
      onShadingChange(shading);
    },
    [onShadingChange]
  );

  const handleTiltChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const tilt = Number(e.target.value);
      setTiltFactor(tilt);
      onTiltChange(tilt);
    },
    [onTiltChange]
  );

  const handleAverageMonthlyConsumptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAverageMonthlyConsumption(Number(e.target.value));
  };

  const handleUtilityRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUtilityRate(Number(e.target.value));
  };

  const handleNetMeteringPolicyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNetMeteringPolicy(e.target.value);
  };

  const handlePanelTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPanelType(e.target.value as PanelType);
  };

  const handleInverterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInverterType(e.target.value);
  };

  const handleFinancingOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFinancingOption(e.target.value as FinancingOption);
  };

  const handleNumberOfYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberOfYears(Number(e.target.value));
  };

  const handleFederalIncentiveRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFederalIncentiveRate(Number(e.target.value));
  };

  const handleStateIncentiveAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStateIncentiveAmount(Number(e.target.value));
  };

  const handleLocalIncentiveAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalIncentiveAmount(Number(e.target.value));
  };

  const handleLoanInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoanInterestRate(Number(e.target.value));
  };

  const handleLoanTermYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoanTermYears(Number(e.target.value));
  };

  const handleMaintenanceCostPerYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaintenanceCostPerYear(Number(e.target.value));
  };

  const handleElectricityInflationRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setElectricityInflationRate(Number(e.target.value));
  };

  const handleIncludeIncentivesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeIncentives(e.target.checked);
  };

  const handleBatteryStorageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBatteryStorage(e.target.checked);
  };

  return (
    <div className="savings-calculator">
      {/* Summary Section */}
      <div className="summary">
        <h2>Solar Savings Summary</h2>
        <p>
          <strong>Payback Period:</strong>{' '}
          {paybackPeriod !== 'N/A' ? `${paybackPeriod} years` : 'Not achieved within timescale'}
        </p>
        <p>
          <strong>Return on Investment (ROI):</strong> {roi.toFixed(2)}%
        </p>
        <p>
          <strong>Net System Cost:</strong> ${netSystemCost.toFixed(2)}
        </p>
        <p>
          <strong>Total Incentives:</strong> ${totalIncentives.toFixed(2)}
        </p>
        <p>
          <strong>First Year Savings:</strong> ${annualSavings[0].toFixed(2)} per year (
          {monthlySavings.toFixed(2)} per month)
        </p>
        <p>
          <strong>Average Annual Savings:</strong> $
          {(totalSavings / numberOfYears).toFixed(2)} per year
        </p>
        <p>
          <strong>Cumulative Savings Over {numberOfYears} Years:</strong> $
          {totalSavings.toFixed(2)}
        </p>
        <p>
          <strong>Cumulative Costs Over {numberOfYears} Years:</strong> $
          {cumulativeCosts[cumulativeCosts.length - 1].toFixed(2)}
        </p>
      </div>

      {/* Inputs Section */}
      <div className="inputs">
        {/* Energy Usage Profile */}
        <div className="input-group">
          <h3>Energy Usage Profile</h3>
          <label>
            Average Monthly Consumption: {averageMonthlyConsumption} kWh
            <input
              type="range"
              min="100"
              max="5000"
              step="50"
              value={averageMonthlyConsumption}
              onChange={handleAverageMonthlyConsumptionChange}
            />
          </label>
          <label>
            Utility Rate: ${utilityRate.toFixed(2)} per kWh
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.005"
              value={utilityRate}
              onChange={handleUtilityRateChange}
            />
          </label>
          <label>
            Net Metering Policy:
            <select
              value={netMeteringPolicy}
              onChange={handleNetMeteringPolicyChange}
            >
              <option value="Full Net Metering">Full Net Metering</option>
              <option value="Partial Net Metering">Partial Net Metering</option>
              <option value="No Net Metering">No Net Metering</option>
            </select>
          </label>
        </div>

        {/* System Configuration */}
        <div className="input-group">
          <h3>System Configuration</h3>
          <label>
            Number of Panels: {numberOfPanels}
            <input
              type="range"
              min="1"
              max={maxPanels}
              value={numberOfPanels}
              onChange={handlePanelChange}
            />
          </label>
          <label>
            Panel Type:
            <select value={panelType} onChange={handlePanelTypeChange}>
              <option value="Monocrystalline">Monocrystalline</option>
              <option value="Polycrystalline">Polycrystalline</option>
              <option value="Thin-film">Thin-film</option>
            </select>
          </label>
          <label>
            Inverter Type:
            <select value={inverterType} onChange={handleInverterTypeChange}>
              <option value="String Inverter">String Inverter</option>
              <option value="Micro Inverter">Micro Inverter</option>
              <option value="Power Optimizer">Power Optimizer</option>
            </select>
          </label>
          <label>
            Include Battery Storage:
            <input
              type="checkbox"
              checked={batteryStorage}
              onChange={handleBatteryStorageChange}
            />
          </label>
        </div>

        {/* Efficiency Factors */}
        <div className="input-group">
          <h3>Efficiency Factors</h3>
          <label>
            Shading Factor: {(shadingFactor * 100).toFixed(0)}%
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.01"
              value={shadingFactor}
              onChange={handleShadingChange}
            />
          </label>
          <label>
            Tilt Factor: {(tiltFactor * 100).toFixed(0)}%
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.01"
              value={tiltFactor}
              onChange={handleTiltChange}
            />
          </label>
          <label>
            Degradation Rate: {(panelSpecs.degradationRate * 100).toFixed(2)}% per year
          </label>
        </div>

        {/* Financial Inputs */}
        <div className="input-group">
          <h3>Financial Inputs</h3>
          <label>
            Financing Option:
            <select value={financingOption} onChange={handleFinancingOptionChange}>
              <option value="cash">Cash Purchase</option>
              <option value="loan">Loan Financing</option>
              <option value="lease">Leasing</option>
            </select>
          </label>

          {financingOption === 'loan' && (
            <>
              <label>
                Loan Interest Rate: {(loanInterestRate * 100).toFixed(2)}%
                <input
                  type="range"
                  min="0.01"
                  max="0.1"
                  step="0.001"
                  value={loanInterestRate}
                  onChange={handleLoanInterestRateChange}
                />
              </label>
              <label>
                Loan Term: {loanTermYears} years
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={loanTermYears}
                  onChange={handleLoanTermYearsChange}
                />
              </label>
            </>
          )}

          <label>
            Include Incentives:
            <input
              type="checkbox"
              checked={includeIncentives}
              onChange={handleIncludeIncentivesChange}
            />
          </label>

          {includeIncentives && (
            <div className="incentives-inputs">
              <label>
                Federal Incentive Rate: {(federalIncentiveRate * 100).toFixed(2)}%
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.01"
                  value={federalIncentiveRate}
                  onChange={handleFederalIncentiveRateChange}
                />
              </label>
              <label>
                State Incentive Amount: ${stateIncentiveAmount}
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={stateIncentiveAmount}
                  onChange={handleStateIncentiveAmountChange}
                />
              </label>
              <label>
                Local Incentive Amount: ${localIncentiveAmount}
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={localIncentiveAmount}
                  onChange={handleLocalIncentiveAmountChange}
                />
              </label>
            </div>
          )}
        </div>

        {/* Cost Factors */}
        <div className="input-group">
          <h3>Cost Factors</h3>
          <label>
            Maintenance Cost per Year: ${maintenanceCostPerYear}
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={maintenanceCostPerYear}
              onChange={handleMaintenanceCostPerYearChange}
            />
          </label>
          <label>
            Electricity Inflation Rate: {(electricityInflationRate * 100).toFixed(2)}%
            <input
              type="range"
              min="0"
              max="0.1"
              step="0.001"
              value={electricityInflationRate}
              onChange={handleElectricityInflationRateChange}
            />
          </label>
        </div>
      </div>

      {/* Timescale Slider */}
      <div className="timescale-slider">
        <label>
          Number of Years: {numberOfYears}
          <input
            type="range"
            min="1"
            max="30"
            value={numberOfYears}
            onChange={handleNumberOfYearsChange}
          />
        </label>
      </div>

      {/* Line Chart */}
      <div className="chart-container">
        <Line
          data={lineChartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' as const },
              title: { display: true, text: 'Cumulative Savings vs. Costs Over Time' },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Amount ($)',
                },
              },
              x: {
                title: {
                  display: true,
                  text: 'Years',
                },
              },
            },
          }}
        />
      </div>

      {/* Bar Chart */}
      <div className="chart-container">
        <Bar
          data={barChartData}
          options={{
            indexAxis: 'y' as const,
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Financial Summary' },
            },
            scales: {
              x: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Amount ($)',
                },
              },
            },
          }}
        />
      </div>

      {/* Pie Chart */}
      <div className="chart-container">
        <Pie
          data={pieChartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'bottom' as const },
              title: { display: true, text: 'Environmental Impact Summary' },
            },
          }}
        />
      </div>

      {/* Additional Information */}
      <div className="additional-info">
        <h3>Environmental Impact Over {numberOfYears} Years</h3>
        <ul>
          <li>
            Total CO₂ Offset: <strong>{totalCO2OffsetKg.toFixed(2)} kg</strong>
          </li>
          <li>
            Equivalent Trees Planted: <strong>{treesPlantedEquivalent.toFixed(2)}</strong>
          </li>
        </ul>
      </div>

      {/* Placeholder for Smart Visualizations */}
      <div className="visualizations">
        <h3>Solar Panel Layout Visualization (Coming Soon)</h3>
        <p>
          A visual representation of the solar panel layout on your property will be displayed here.
        </p>
      </div>
    </div>
  );
};

export default SavingsCalculator;
