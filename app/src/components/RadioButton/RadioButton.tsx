import React, { RefObject, useState } from 'react';
import './RadioButton.scss';

type RadioButtonType = {
  path: string;
  id: string;
  class: string;
  value: string;
  onClick: (event: React.MouseEvent<HTMLLabelElement, MouseEvent>) => void;
};

export const RadioButton: React.FC<RadioButtonType> = (props) => {
  return (
    <label onClick={props.onClick} id={props.id}>
      <input
        type="radio"
        name="rating"
        className={props.class}
        id={props.id}
        value={props.value}
      />
      <svg viewBox="0 0 24 24" width="24" height="24">
        <path d={props.path} id={props.id} />
      </svg>
    </label>
  );
};
