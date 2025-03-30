import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { ToggleButton, ToggleButtonGroup, Box, Typography } from '@mui/material';
import { AttachMoney, Timeline } from '@mui/icons-material';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Interface for data point in savings projection
 * @interface DataPoint
 * @property {number} year - The year number (1-25)
 * @property {number} withoutSolar - Cumulative cost without solar
 * @property {number} withSolar - Cumulative cost with solar
 * @property {number} savings - Cumulative savings (withoutSolar - withSolar)
 */
interface DataPoint {
  year: number;
  withoutSolar: number;
  withSolar: number;
  savings: number;
}

/**
 * Props interface for the ChartDisplay component
 * @interface ChartDisplayProps
 * @property {DataPoint[]} data - Array of data points for the savings projection
 * @property {number} systemCost - Total cost of the solar system
 * @property {number} monthlyBill - Current monthly electricity bill
 * @property {number} [inflationRate=0.029] - Annual electricity price inflation rate
 */
interface ChartDisplayProps {
  years: number[];
  cumulativeSavings: number[];
  cumulativeCosts: number[];
  monthlyPayments: number[];
  utilityBills: number[];
}

/**
 * ChartDisplay Component
 * 
 * Displays a line chart showing the projected costs and savings over time
 * when using solar panels compared to traditional electricity. The chart
 * includes three lines:
 * 1. Cumulative cost without solar
 * 2. Cumulative cost with solar (including initial system cost)
 * 3. Cumulative savings
 * 
 * The chart is interactive with tooltips showing exact values at each year.
 * 
 * @component
 * @param {ChartDisplayProps} props - Component props
 * @param {DataPoint[]} props.data - Array of yearly cost and savings data points
 * @param {number} props.systemCost - Total cost of the solar system
 * @param {number} props.monthlyBill - Current monthly electricity bill
 * @param {number} [props.inflationRate=0.029] - Annual electricity price inflation rate
 * @returns {JSX.Element} Rendered chart component
 * 
 * @example
 * ```tsx
 * const data = [
 *   { year: 1, withoutSolar: 1200, withSolar: 15000, savings: -13800 },
 *   { year: 2, withoutSolar: 2400, withSolar: 15200, savings: -12800 },
 *   // ... more years
 * ];
 * 
 * <ChartDisplay
 *   data={data}
 *   systemCost={15000}
 *   monthlyBill={100}
 *   inflationRate={0.029}
 * />
 * ```
 */
const ChartDisplay: React.FC<ChartDisplayProps> = ({
  years,
  cumulativeSavings,
  cumulativeCosts,
  monthlyPayments,
  utilityBills,
}) => {
  const [chartType, setChartType] = useState<'monthly' | 'cumulative'>('monthly');

  const handleChartTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: 'monthly' | 'cumulative',
  ) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  const monthlyData = {
    labels: years,
    datasets: [
      {
        label: 'Monthly Solar Payment',
        data: monthlyPayments,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        tension: 0.1,
        fill: true,
      },
      {
        label: 'Monthly Utility Bill without Solar',
        data: utilityBills,
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.1)',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const cumulativeData = {
    labels: years,
    datasets: [
      {
        label: 'Cumulative Utility Savings',
        data: cumulativeSavings,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.1,
        fill: true,
      },
      {
        label: 'Total Solar Investment Cost',
        data: cumulativeCosts,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const monthlyOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'Monthly Cost Comparison',
        padding: 20,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let value = context.parsed.y;
            return `${context.dataset.label}: $${value.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Monthly Cost ($)',
          padding: 20,
        },
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Year',
          padding: 10,
        }
      }
    },
  };

  const cumulativeOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'Cumulative Savings vs. Investment Cost',
        padding: 20,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let value = context.parsed.y;
            return `${context.dataset.label}: $${value.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Amount ($)',
          padding: 20,
        },
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Year',
          padding: 10,
        }
      }
    },
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          aria-label="chart type"
        >
          <ToggleButton value="monthly" aria-label="monthly costs">
            <AttachMoney sx={{ mr: 1 }} />
            <Typography variant="body2">Monthly Costs</Typography>
          </ToggleButton>
          <ToggleButton value="cumulative" aria-label="cumulative savings">
            <Timeline sx={{ mr: 1 }} />
            <Typography variant="body2">Breakeven Analysis</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ height: '400px', width: '100%' }}>
        {chartType === 'monthly' ? (
          <Line data={monthlyData} options={monthlyOptions} />
        ) : (
          <Line data={cumulativeData} options={cumulativeOptions} />
        )}
      </Box>
    </Box>
  );
};

export default ChartDisplay;