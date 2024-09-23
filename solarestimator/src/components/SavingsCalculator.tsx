import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SavingsCalculatorProps {
  solarData: {
    maxArrayPanelsCount: number;
    maxArrayAreaMeters2: number;
    maxSunshineHoursPerYear: number;
    carbonOffsetFactorKgPerMwh: number;
  };
  bill: number;
}

const SavingsCalculator: React.FC<SavingsCalculatorProps> = ({ solarData, bill }) => {
  // State variables
  const [numberOfPanels, setNumberOfPanels] = useState(Math.min(solarData.maxArrayPanelsCount, 20));
  const [shadingFactor, setShadingFactor] = useState(0.9); // Default 90% efficiency
  const [tiltFactor, setTiltFactor] = useState(0.9); // Default 90% efficiency
  const [financingOption, setFinancingOption] = useState('cash');
  const [numberOfYears, setNumberOfYears] = useState(20); // Default 20 years

  // Constants
  const averagePanelOutputKw = 0.3; // 300 watts
  const electricityCostPerKwh = 0.12; // $0.12 per kWh
  const installationCostPerKw = 2500; // $2500 per kW
  const interestRate = 0.04; // 4% interest rate
  const leaseCostPerYear = 500; // $500 per year
  const loanTermYears = 10; // 10-year loan

  // Adjusted variables
  const maxPanels = Math.min(solarData.maxArrayPanelsCount, 50); // Max 50 panels

  // Calculations
  const systemSizeKw = numberOfPanels * averagePanelOutputKw;
  const systemCost = systemSizeKw * installationCostPerKw;

  const totalEnergyProductionPerYearKwh =
    systemSizeKw * solarData.maxSunshineHoursPerYear * shadingFactor * tiltFactor;

  const yearlySavings = totalEnergyProductionPerYearKwh * electricityCostPerKwh;

  // Financing calculations
  const monthlyLoanPayment =
    (systemCost * (interestRate / 12)) /
    (1 - Math.pow(1 + interestRate / 12, -loanTermYears * 12));

  let totalCost: number;
  let paybackPeriod: number;

  if (financingOption === 'cash') {
    totalCost = systemCost;
    paybackPeriod = systemCost / yearlySavings;
  } else if (financingOption === 'loan') {
    totalCost = monthlyLoanPayment * loanTermYears * 12;
    paybackPeriod = totalCost / yearlySavings;
  } else {
    totalCost = leaseCostPerYear * numberOfYears;
    paybackPeriod = totalCost / yearlySavings;
  }

  // Environmental Impact Calculations
  const kgCO2PerKwh = 0.475;
  const totalCO2OffsetKg = totalEnergyProductionPerYearKwh * kgCO2PerKwh;
  const kgCO2OffsetPerTree = 22;
  const treesSaved = totalCO2OffsetKg / kgCO2OffsetPerTree;

  // Chart Data
  const years = Array.from({ length: numberOfYears }, (_, i) => i + 1);
  const cumulativeSavings = years.map((year) => yearlySavings * year);
  const cumulativeCosts = years.map((year) =>
    financingOption === 'cash'
      ? Math.min(systemCost, yearlySavings * year)
      : financingOption === 'loan'
      ? Math.min(totalCost, monthlyLoanPayment * 12 * year)
      : leaseCostPerYear * year
  );

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
    labels: ['Annual Savings', 'Total Cost', 'Payback Period (Years)', 'CO₂ Offset (kg/year)'],
    datasets: [
      {
        label: 'Summary',
        data: [
          yearlySavings,
          totalCost,
          paybackPeriod,
          totalCO2OffsetKg,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
      },
    ],
  };

  return (
    <div className="savings-calculator">
      <h3>Estimated Annual Savings</h3>
      <p>
        <strong>${yearlySavings.toFixed(2)} per year</strong> (
        ${(yearlySavings / 12).toFixed(2)} per month)
      </p>

      <h4>
        Your solar system could offset about{' '}
        {((yearlySavings / (bill * 12)) * 100).toFixed(2)}% of your annual electric bill.
      </h4>

      <p>
        Based on your selected financing option, the total cost of the system is estimated at{' '}
        <strong>${totalCost.toFixed(2)}</strong>, and the system will pay for itself in{' '}
        <strong>{paybackPeriod.toFixed(2)} years</strong>.
      </p>

      <div className="inputs">
        <label
          title="Adjust the number of solar panels. Typical residential systems have between 10 and 20 panels."
        >
          Number of Panels: {numberOfPanels}
          <input
            type="range"
            min="1"
            max={maxPanels}
            value={numberOfPanels}
            onChange={(e) => setNumberOfPanels(Number(e.target.value))}
          />
        </label>
        <label
          title="Adjust for shading impact. A lower value means more shading and less efficiency."
        >
          Shading Factor: {(shadingFactor * 100).toFixed(0)}%
          <input
            type="range"
            min="0.5"
            max="1"
            step="0.05"
            value={shadingFactor}
            onChange={(e) => setShadingFactor(Number(e.target.value))}
          />
        </label>
        <label
          title="Adjust for tilt and orientation impact. Optimal tilt/orientation gives 100% efficiency."
        >
          Tilt Factor: {(tiltFactor * 100).toFixed(0)}%
          <input
            type="range"
            min="0.5"
            max="1"
            step="0.05"
            value={tiltFactor}
            onChange={(e) => setTiltFactor(Number(e.target.value))}
          />
        </label>
        <label title="Select the number of years over which to calculate savings.">
          Number of Years: {numberOfYears}
          <input
            type="range"
            min="1"
            max="30"
            value={numberOfYears}
            onChange={(e) => setNumberOfYears(Number(e.target.value))}
          />
        </label>

        <div>
          <label title="Choose your financing option.">
            Financing Option:
            <select value={financingOption} onChange={(e) => setFinancingOption(e.target.value)}>
              <option value="cash">Cash Purchase</option>
              <option value="loan">Loan Financing</option>
              <option value="lease">Leasing</option>
            </select>
          </label>
        </div>
      </div>

      {/* Line Chart */}
      <div className="chart-container">
        <Line
          data={lineChartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
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
            indexAxis: 'y',
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Summary Statistics' },
            },
            scales: {
              x: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Value',
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default SavingsCalculator;
