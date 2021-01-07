import React, { RefObject, useState } from 'react';
import { InputSectionProps } from '../../types/types';
import './InputSection.scss';

import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export const InputSection = (props: InputSectionProps) => {
  return (
    <FormControl variant="outlined">
      <InputLabel htmlFor="outlined-age-native-simple">
        {props.placeholder}
      </InputLabel>
      <Select
        native
        value={props.value}
        onChange={props.onChange}
        label="Age"
        inputProps={{
          name: 'age',
          id: 'outlined-age-native-simple',
        }}
      >
        <option aria-label="None" value="" />
        <option value={10}>Ten</option>
        <option value={20}>Twenty</option>
        <option value={30}>Thirty</option>
      </Select>
    </FormControl>
  );
};

{
  /* <input
      type={props.type}
      placeholder={props.placeholder}
      autoComplete="off"
      value={props.value}
      onChange={props.onChange}
    /> */
}
