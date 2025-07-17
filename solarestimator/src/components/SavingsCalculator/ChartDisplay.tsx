import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import { ToggleButton, ToggleButtonGroup, Box, Typography, Paper } from '@mui/material';
import { AttachMoney, Timeline, TrendingUp, TrendingDown } from '@mui/icons-material';

// Import centralized Chart.js configuration
import '../../utils/chartConfig';

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
        borderColor: 'rgb(34, 197, 94)', // Green-500
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Monthly Utility Bill without Solar',
        data: utilityBills,
        borderColor: 'rgb(239, 68, 68)', // Red-500
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const cumulativeData = {
    labels: years,
    datasets: [
      {
        label: 'Cumulative Utility Savings',
        data: cumulativeSavings,
        borderColor: 'rgb(59, 130, 246)', // Blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Total Solar Investment Cost',
        data: cumulativeCosts,
        borderColor: 'rgb(168, 85, 247)', // Purple-500
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointBackgroundColor: 'rgb(168, 85, 247)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
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
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 14,
            weight: 'bold'
          },
          color: '#374151' // Gray-700
        },
      },
      title: {
        display: true,
        text: 'Monthly Cost Comparison',
        padding: 20,
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 18,
          weight: 'bold'
        },
        color: '#1f2937' // Gray-800
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
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
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 14,
            weight: 'bold'
          },
          color: '#374151'
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12
          },
          color: '#6b7280',
          callback: function(value: any) {
            return '$' + value.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });
          }
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
          lineWidth: 1
        }
      },
      x: {
        title: {
          display: true,
          text: 'Year',
          padding: 10,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 14,
            weight: 'bold'
          },
          color: '#374151'
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12
          },
          color: '#6b7280'
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
          lineWidth: 1
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
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 14
          },
          color: '#374151'
        },
      },
      title: {
        display: true,
        text: 'Cumulative Savings vs. Investment Cost',
        padding: 20,
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 18,
          weight: 'bold'
        },
        color: '#1f2937'
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
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
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 14
          },
          color: '#374151'
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12
          },
          color: '#6b7280',
          callback: function(value: any) {
            return '$' + value.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });
          }
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
          lineWidth: 1
        }
      },
      x: {
        title: {
          display: true,
          text: 'Year',
          padding: 10,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 14
          },
          color: '#374151'
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12
          },
          color: '#6b7280'
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
          lineWidth: 1
        }
      }
    },
  };

  return (
    <Paper elevation={0} sx={{ 
      width: '100%', 
      p: 3,
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      borderRadius: 3,
      border: '1px solid rgba(226, 232, 240, 0.8)'
    }}>
      {/* Enhanced Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        p: 2,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: 2,
        border: '1px solid rgba(226, 232, 240, 0.8)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp sx={{ color: '#059669', fontSize: 24 }} />
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold',
            color: '#1f2937',
            fontFamily: 'Inter, system-ui, sans-serif'
          }}>
            Financial Analysis
          </Typography>
        </Box>
        
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          aria-label="chart type"
          sx={{
            '& .MuiToggleButton-root': {
              border: '1px solid rgba(226, 232, 240, 0.8)',
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
              fontFamily: 'Inter, system-ui, sans-serif',
              '&.Mui-selected': {
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                }
              },
              '&:hover': {
                background: 'rgba(59, 130, 246, 0.1)',
              }
            }
          }}
        >
          <ToggleButton value="monthly" aria-label="monthly costs">
            <AttachMoney sx={{ mr: 1, fontSize: 18 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Monthly Costs
            </Typography>
          </ToggleButton>
          <ToggleButton value="cumulative" aria-label="cumulative savings">
            <Timeline sx={{ mr: 1, fontSize: 18 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Breakeven Analysis
            </Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      {/* Chart Container */}
      <Box sx={{ 
        height: '450px', 
        width: '100%',
        background: 'white',
        borderRadius: 2,
        p: 2,
        border: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}>
        {chartType === 'monthly' ? (
          <Line data={monthlyData} options={monthlyOptions} />
        ) : (
          <Line data={cumulativeData} options={cumulativeOptions} />
        )}
      </Box>
    </Paper>
  );
};

export default ChartDisplay;