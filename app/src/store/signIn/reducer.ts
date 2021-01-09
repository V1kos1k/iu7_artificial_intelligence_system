import { Reducer } from 'redux';
import { SignInActionTypes, SignInActions } from './actionTypes';
import { ProfileType, ReferenceType } from '../../types/types';

export type signInReducerState = {
  profile: ProfileType;
  userData: any;
  ratingGames: object;
  ratingGamesGame: object;
  filtering: (string | number)[][];

  reference: {
    online: boolean;
    age_restriction: number;
    year_of_manufacture: number[];
    rating: number;
    publisher: string;
  };
  error: boolean;
  searching: (string | number)[][][];
};

const initialState: signInReducerState = {
  profile: { name: '', title: '', index: -1 },
  userData: [],
  ratingGames: {},
  ratingGamesGame: {},
  filtering: [],

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
    case SignInActionTypes.INPUT_NAME_REQUEST:
      return {
        ...state,
        profile: {
          name: action.name,
          title: state.profile.title,
          index: state.profile.index,
        },
        ratingGamesGame: action.ratingGamesGame,
        error: false,
      };

    case SignInActionTypes.INPUT_TITLE_REQUEST:
      return {
        ...state,
        profile: {
          name: state.profile.name,
          title: action.title,
          index: action.index,
        },
        ratingGames: action.ratingGames,
        error: false,
      };

    case SignInActionTypes.INPUT_NAME_FAILURE:
      return {
        ...state,
        error: true,
      };

    case SignInActionTypes.INPUT_TITLE_FAILURE:
      return {
        ...state,
        error: true,
      };

    case SignInActionTypes.FILTERING_REQUEST:
      return {
        ...state,
        filtering: action.filtering,
        error: false,
      };

    case SignInActionTypes.FILTERING_FAILURE:
      return {
        ...state,
        error: true,
      };

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
