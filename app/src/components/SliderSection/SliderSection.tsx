import React from 'react';
import { SliderSectionProps } from '../../types/types';
import './SliderSection.scss';

import Slider from '@material-ui/core/Slider';

export const SliderSection = (props: SliderSectionProps) => {
  return (
    <div className="slider-section">
      <p className="filter__label">{props.label}</p>
      <Slider
        value={props.value}
        onChange={props.onChange}
        valueLabelDisplay="auto"
        aria-labelledby={props.ariaLabelledby}
        className="slider"
        min={props.min}
        max={props.max}
        marks={props.marks}
      />
    </div>
  );
};
