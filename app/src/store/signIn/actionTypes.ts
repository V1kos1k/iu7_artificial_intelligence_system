import { RequestError } from 'redux-api-middleware';

export enum SignInActionTypes {
  INPUT_NAME_REQUEST = 'signIn.INPUT_NAME_REQUEST',
  INPUT_NAME_FAILURE = 'signIn.INPUT_NAME_FAILURE',
  INPUT_TITLE_REQUEST = 'signIn.INPUT_TITLE_REQUEST',
  INPUT_TITLE_FAILURE = 'signIn.INPUT_TITLE_FAILURE',

  COLALABORATIVE_FILTERING_REQUEST = 'signIn.COLALABORATIVE_FILTERING_REQUEST',
  COLALABORATIVE_FILTERING_FAILURE = 'signIn.COLALABORATIVE_FILTERING_FAILURE',
}

export type signInFindName = {
  type: SignInActionTypes.INPUT_NAME_REQUEST;
  name: string;
  index: number;
  ratingGames: object;
};

export type signInFindNameFailure = {
  type: SignInActionTypes.INPUT_NAME_FAILURE;
  name: RequestError;
};

export type signInFindTitle = {
  type: SignInActionTypes.INPUT_TITLE_REQUEST;
  title: string;
};

export type signInFindTitleFailure = {
  type: SignInActionTypes.INPUT_TITLE_FAILURE;
  title: RequestError;
};

export type collaborativeFiltering = {
  type: SignInActionTypes.COLALABORATIVE_FILTERING_REQUEST;
  collaborativeFiltering: (string | number)[][];
};

export type collaborativeFilteringFailure = {
  type: SignInActionTypes.COLALABORATIVE_FILTERING_FAILURE;
  collaborativeFiltering: RequestError;
};

export type SignInActions =
  | signInFindName
  | signInFindNameFailure
  | signInFindTitle
  | signInFindTitleFailure
  | collaborativeFiltering
  | collaborativeFilteringFailure;
