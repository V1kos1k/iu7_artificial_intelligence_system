import { RequestError } from 'redux-api-middleware';

export enum SignInActionTypes {
  INPUT_NAME_REQUEST = 'signIn.INPUT_NAME_REQUEST',
  INPUT_NAME_FAILURE = 'signIn.INPUT_NAME_FAILURE',
  INPUT_TITLE_REQUEST = 'signIn.INPUT_TITLE_REQUEST',
  INPUT_TITLE_FAILURE = 'signIn.INPUT_TITLE_FAILURE',

  FILTERING_REQUEST = 'signIn.FILTERING_REQUEST',
  FILTERING_FAILURE = 'signIn.FILTERING_FAILURE',
}

export type signInFindName = {
  type: SignInActionTypes.INPUT_NAME_REQUEST;
  name: string;
};

export type signInFindNameFailure = {
  type: SignInActionTypes.INPUT_NAME_FAILURE;
  name: RequestError;
};

export type signInFindTitle = {
  type: SignInActionTypes.INPUT_TITLE_REQUEST;
  title: string;
  ratingGames: object;
  index: number;
};

export type signInFindTitleFailure = {
  type: SignInActionTypes.INPUT_TITLE_FAILURE;
  title: RequestError;
};

export type filtering = {
  type: SignInActionTypes.FILTERING_REQUEST;
  filtering: (string | number)[][];
};

export type filteringFailure = {
  type: SignInActionTypes.FILTERING_FAILURE;
  filtering: RequestError;
};

export type SignInActions =
  | signInFindName
  | signInFindNameFailure
  | signInFindTitle
  | signInFindTitleFailure
  | filtering
  | filteringFailure;
