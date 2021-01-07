import { RequestError } from 'redux-api-middleware';
import { ReferenceType } from '../../types/types';

export enum SignInActionTypes {
  INPUT_REFERENCE_REQUEST = 'signIn.INPUT_REFERENCE_REQUEST',
  INPUT_REFERENCE_FAILURE = 'signIn.INPUT_REFERENCE_FAILURE',

  SEARCHING_REQUEST = 'signIn.SEARCHING_REQUEST',
  SEARCHING_FAILURE = 'signIn.SEARCHING_FAILURE',
}

export type signInFindReference = {
  type: SignInActionTypes.INPUT_REFERENCE_REQUEST;
  reference: ReferenceType;
};

export type signInFindReferenceFailure = {
  type: SignInActionTypes.INPUT_REFERENCE_FAILURE;
  reference: RequestError;
};

export type searching = {
  type: SignInActionTypes.SEARCHING_REQUEST;
  searching: (string | number)[][];
};

export type searchingFailure = {
  type: SignInActionTypes.SEARCHING_FAILURE;
  searching: RequestError;
};

export type SignInActions =
  | signInFindReference
  | signInFindReferenceFailure
  | searching
  | searchingFailure;
