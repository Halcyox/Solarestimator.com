import React from 'react';
import { Slider, Typography, FormControl } from '@mui/material';
import '../../styles/system-configuration.css';

/**
 * Props interface for the TimelineControl component
 * @interface TimelineControlProps
 * @property {number} timelineYears - Current timeline length in years
 * @property {number} maxYears - Maximum allowed timeline length in years
 * @property {(years: number) => void} onTimelineChange - Callback when timeline length changes
 */
interface TimelineControlProps {
  timelineYears: number;
  maxYears: number;
  onTimelineChange: (years: number) => void;
}

/**
 * TimelineControl component provides a slider interface for adjusting the timeline
 * length for solar savings calculations. Users can select how many years into the
 * future they want to project their solar savings.
 * 
 * @component
 * @param {TimelineControlProps} props - Component props
 * @returns {React.ReactElement} A form control containing a slider for timeline adjustment
 */
const TimelineControl: React.FC<TimelineControlProps> = ({
  timelineYears,
  maxYears,
  onTimelineChange,
}) => {
  return (
    <FormControl fullWidth margin="normal">
      <Typography gutterBottom>
        Timeline Length (Years)
      </Typography>
      <Slider
        value={timelineYears}
        onChange={(_, value) => onTimelineChange(value as number)}
        min={1}
        max={maxYears}
        marks
        step={1}
        valueLabelDisplay="auto"
        aria-label="Timeline length in years"
        className="custom-slider"
      />
    </FormControl>
  );
};

export default TimelineControl;