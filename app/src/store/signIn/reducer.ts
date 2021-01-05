import { Reducer } from 'redux';
import { SignInActionTypes, SignInActions } from './actionTypes';
import { ProfileType } from '../../types/types';

export type signInReducerState = {
  profile: ProfileType;
  userData: any;
  error: boolean;
  ratingGames: object;
  filtering: (string | number)[][];
};

const initialState: signInReducerState = {
  profile: { name: '', title: '', index: -1 },
  userData: [],
  error: false,
  ratingGames: {},
  filtering: [],
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

    default:
      return state;
  }
};

export { signInReducer };
