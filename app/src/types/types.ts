import { Mark } from '@material-ui/core/Slider';
import { RefObject } from 'react';

export type ReferenceType = {
  online: boolean;
  age_restriction: number;
  year_of_manufacture: number[];
  rating: number;
  publisher: string;
};

export type SelectSectionProps = {
  value: string | number;
  reff?: RefObject<HTMLDivElement>;
  onChange: (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>,
    child: React.ReactNode
  ) => void;
  placeholder: string;
};

export type InputSectionProps = {
  value: string | number;
  onChange: (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>,
    child: React.ReactNode
  ) => void;
  placeholder: string;
};

export type SliderSectionProps = {
  value: number | number[];
  label: string;
  min: number;
  max: number;
  marks: boolean | Mark[] | undefined;
  ariaLabelledby: string;
  onChange: (event: React.ChangeEvent<{}>, newValue: number | number[]) => void;
};

export type TextSectionProps = {
  value: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type ButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};
