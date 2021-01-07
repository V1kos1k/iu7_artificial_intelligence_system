import React from 'react';
import './Button.scss';

import TextField from '@material-ui/core/TextField';
import { ButtonProps } from '../../types/types';

export const Button = (props: ButtonProps) => {
  return (
    <button className="learn-more" onClick={props.onClick}>
      Поиск
    </button>
  );
};
