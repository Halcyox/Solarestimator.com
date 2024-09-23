import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface SavingsCalculatorProps {
  solarData: {
    maxArrayPanelsCount: number;
    maxArrayAreaMeters2: number;
    maxSunshineHoursPerYear: number;
    carbonOffsetFactorKgPerMwh: number;
  };
  bill: number; // User's monthly electricity bill
}

const SavingsCalculator: React.FC<SavingsCalculatorProps> = ({ solarData, bill }) => {
  const [numberOfPanels, setNumberOfPanels] = useState(solarData.maxArrayPanelsCount);
  const [shadingFactor, setShadingFactor] = useState(0.9); // 90% efficiency due to shading
  const [tiltFactor, setTiltFactor] = useState(0.9); // 90% efficiency due to tilt/orientation
  const [financingOption, setFinancingOption] = useState('cash'); // Options: 'cash', 'lease', 'loan'

  const averagePanelOutputKw = 0.3; // Average panel output in kW (300 watts)
  const electricityCostPerKwh = 0.12; // Average electricity cost per kWh
  const solarEfficiency = 0.85 * shadingFactor * tiltFactor; // Efficiency factoring in losses

  // Cost factors
  const installationCostPerKw = 2500; // Average installation cost per kW of solar power
  const interestRate = 0.04; // 4% loan interest rate
  const leaseCostPerYear = 500; // Annual cost for leasing option
  const loanTermYears = 10; // Loan period for financed system

  // Calculate total energy production potential in kWh per year
  const totalEnergyProductionPerYearKwh =
    numberOfPanels * averagePanelOutputKw * solarData.maxSunshineHoursPerYear * solarEfficiency;

  // Calculate the potential savings per year based on energy production
  const yearlySavings = totalEnergyProductionPerYearKwh * electricityCostPerKwh;

  // Calculate monthly savings
  const monthlySavings = yearlySavings / 12;

  // Calculate the percentage of the bill offset by solar energy
  const percentageBillOffset = (monthlySavings / bill) * 100;

  // Calculate the cost of the system
  const systemCost = numberOfPanels * averagePanelOutputKw * installationCostPerKw;

  // Calculate payback period (in years) for cash purchase
  const paybackPeriodCash = systemCost / yearlySavings;

  // Loan financing calculations
  const monthlyLoanPayment =
    (systemCost * interestRate) / (1 - Math.pow(1 + interestRate, -loanTermYears * 12));

  // Determine total cost and payback period based on financing option
  let totalCost: number;
  let paybackPeriod: number;

  if (financingOption === 'cash') {
    totalCost = systemCost;
    paybackPeriod = paybackPeriodCash;
  } else if (financingOption === 'loan') {
    totalCost = monthlyLoanPayment * loanTermYears * 12;
    paybackPeriod = totalCost / yearlySavings;
  } else {
    totalCost = leaseCostPerYear * loanTermYears;
    paybackPeriod = totalCost / yearlySavings;
  }

  // Chart Data (Comparison of savings vs costs over 20 years)
  const years = Array.from({ length: 20 }, (_, i) => i + 1);
  const chartData = {
    labels: years.map((year) => `Year ${year}`),
    datasets: [
      {
        label: 'Cumulative Savings ($)',
        data: years.map((year) => yearlySavings * year),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.3,
      },
      {
        label: 'Cumulative Costs ($)',
        data: years.map((year) =>
          financingOption === 'cash'
            ? Math.min(systemCost, yearlySavings * year)
            : financingOption === 'loan'
            ? Math.min(totalCost, monthlyLoanPayment * 12 * year)
            : Math.min(leaseCostPerYear * year, yearlySavings * year)
        ),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="savings-calculator">
      <h3>Estimated Annual Savings</h3>
      <p>
        <strong>${yearlySavings.toFixed(2)} per year</strong> ({monthlySavings.toFixed(2)} per month)
      </p>

      <h4>Your solar system could offset about {percentageBillOffset.toFixed(2)}% of your monthly electric bill.</h4>

      <p>
        Based on your selected financing option, the total cost of the system is estimated at{' '}
        <strong>${totalCost.toFixed(2)}</strong>, and the system will pay for itself in{' '}
        <strong>{paybackPeriod.toFixed(2)} years</strong>.
      </p>

      <div className="inputs">
        <label>
          Number of Panels: {numberOfPanels}
          <input
            type="range"
            min="0"
            max={solarData.maxArrayPanelsCount}
            value={numberOfPanels}
            onChange={(e) => setNumberOfPanels(Number(e.target.value))}
          />
        </label>
        <label>
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
        <label>
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

        <div>
          <label>
            Financing Option:
            <select
              value={financingOption}
              onChange={(e) => setFinancingOption(e.target.value)}
            >
              <option value="cash">Cash Purchase</option>
              <option value="loan">Loan Financing</option>
              <option value="lease">Leasing</option>
            </select>
          </label>
        </div>
      </div>

      <div className="chart-container">
        <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
      </div>
    </div>
  );
};

export default SavingsCalculator;
