import { signInReducer, signInReducerState } from './signIn/reducer';
import { History } from 'history';

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

export type AppState = {
  signIn: signInReducerState;
  [propName: string]: any;
};

export const reducers = (history: History) =>
  combineReducers<AppState>({
    router: connectRouter(history),
    signIn: signInReducer,
  });
