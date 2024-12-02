import React from 'react';
import { Slider, Typography } from '@mui/material';

interface TimelineControlProps {
  years: number;
  onYearsChange: (value: number) => void;
}

const TimelineControl: React.FC<TimelineControlProps> = ({
  years,
  onYearsChange,
}) => {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Timeline
      </Typography>
      <div>
        <Typography gutterBottom>
          Projection Period: {years} years
        </Typography>
        <Slider
          value={years}
          onChange={(_, value) => onYearsChange(value as number)}
          min={5}
          max={30}
          step={1}
          marks={[
            { value: 5, label: '5y' },
            { value: 10, label: '10y' },
            { value: 20, label: '20y' },
            { value: 30, label: '30y' },
          ]}
          valueLabelDisplay="auto"
        />
      </div>
    </div>
  );
};

export default TimelineControl;
