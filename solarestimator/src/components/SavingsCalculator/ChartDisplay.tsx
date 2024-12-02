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
} from 'chart.js';
import { ToggleButton, ToggleButtonGroup, Box, Typography } from '@mui/material';
import { AttachMoney, Timeline } from '@mui/icons-material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDisplayProps {
  years: number[];
  cumulativeSavings: number[];
  cumulativeCosts: number[];
  monthlyPayments: number[];
  utilityBills: number[];
}

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

  const monthlyOptions = {
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

  const cumulativeOptions = {
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
