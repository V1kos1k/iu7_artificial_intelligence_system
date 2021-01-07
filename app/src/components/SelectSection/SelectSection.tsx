import React, { RefObject, useState } from 'react';
import { SelectSectionProps } from '../../types/types';
import './SelectSection.scss';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export const SelectSection = (props: SelectSectionProps) => {
  return (
    <>
      <FormControl variant="outlined" className="select-section">
        <InputLabel id="demo-simple-select-outlined-label">
          {props.placeholder}
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          className="segment__select"
          value={props.value}
          onChange={props.onChange}
          label={props.placeholder}
        >
          <MenuItem key={1} value={0}>
            0
          </MenuItem>
          <MenuItem key={14} value={14}>
            14
          </MenuItem>
          <MenuItem key={16} value={16}>
            16
          </MenuItem>
          <MenuItem key={18} value={18}>
            18
          </MenuItem>
          <MenuItem key={21} value={21}>
            21
          </MenuItem>
        </Select>
      </FormControl>
    </>
  );
};
