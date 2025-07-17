import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Import centralized Chart.js configuration
import '../../utils/chartConfig';

interface ChartProps {
  lineChartData: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      tension: number;
      fill: boolean;
    }>;
  };
  barChartData: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string[];
    }>;
  };
  pieChartData: {
    labels: string[];
    datasets: Array<{
      data: number[];
      backgroundColor: string[];
    }>;
  };
}

const ChartsSection: React.FC<ChartProps> = ({ lineChartData, barChartData, pieChartData }) => {
  return (
    <div className="chart-container">
      {/* Line Chart */}
      <div className="line-chart">
        <Line
          data={lineChartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: {
                display: true,
                text: 'Cumulative Savings vs. Costs Over Time',
              },
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
      <div className="bar-chart">
        <Bar
          data={barChartData}
          options={{
            indexAxis: 'y',
            responsive: true,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: 'Financial Summary',
              },
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
      <div className="pie-chart">
        <Pie
          data={pieChartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'bottom' },
              title: {
                display: true,
                text: 'Environmental Impact Summary',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ChartsSection;
