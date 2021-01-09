import React, { RefObject, useState } from 'react';
import { InputSectionProps } from '../../types/types';
import './InputSection.scss';

export const InputSection = (props: InputSectionProps) => {
  return (
    <div className={`input-section ${props.class}`} ref={props.reff}>
      <input
        type="name"
        placeholder={props.placeholder}
        autoComplete="off"
        value={props.value}
        onChange={props.onChange}
      />
      <div className="animated-button">
        <span className={props.value ? 'icon-lock next' : 'icon-lock'}>
          {/* <span className="icon-lock next"> */}
          <i className="fa fa-lock" />
        </span>
        <span className="next-button">
          <i className={`fa ${props.icon}`} onClick={props.onClick} />
        </span>
      </div>
    </div>
  );
};
