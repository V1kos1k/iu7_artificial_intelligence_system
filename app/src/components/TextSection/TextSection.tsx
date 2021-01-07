import React from 'react';
import './TextSection.scss';

import TextField from '@material-ui/core/TextField';
import { TextSectionProps } from '../../types/types';

export const TextSection = (props: TextSectionProps) => {
  return (
    <TextField
      className="text-section"
      label={props.label}
      value={props.value}
      onChange={props.onChange}
      variant="outlined"
    />
  );
};
