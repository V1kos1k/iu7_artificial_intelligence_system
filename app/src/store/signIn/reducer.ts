import { Reducer } from 'redux';
import { SignInActionTypes, SignInActions } from './actionTypes';
import { ReferenceType } from '../../types/types';

export type signInReducerState = {
  reference: {
    online: boolean;
    age_restriction: number;
    year_of_manufacture: number[];
    rating: number;
    publisher: string;
  };
  error: boolean;
  searching: (string | number)[][];
};

const initialState: signInReducerState = {
  reference: {
    online: false,
    age_restriction: 0,
    year_of_manufacture: [1980, 2021],
    rating: 50,
    publisher: '',
  },
  error: false,
  searching: [],
};

const signInReducer: Reducer<signInReducerState, SignInActions> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SignInActionTypes.INPUT_REFERENCE_REQUEST:
      return {
        ...state,
        reference: action.reference,
        error: false,
      };

    case SignInActionTypes.INPUT_REFERENCE_FAILURE:
      return {
        ...state,
        error: true,
      };

    case SignInActionTypes.SEARCHING_REQUEST:
      return {
        ...state,
        searching: action.searching,
        error: false,
      };

    case SignInActionTypes.SEARCHING_FAILURE:
      return {
        ...state,
        error: true,
      };

    default:
      return state;
  }
};

export { signInReducer };
