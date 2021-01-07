import * as types from './actionTypes';
import { ActionCreator, Dispatch } from 'redux';
import { RequestError } from 'redux-api-middleware';
import { AppState } from '../reducers';

import data from '../../data/user_data.json';
import data_nodes from '../../data/filename_nodes_full.json';
import { ReferenceType } from '../../types/types';

export const referenceInputRequestAction: ActionCreator<types.signInFindReference> = (
  reference: ReferenceType
) => {
  return {
    type: types.SignInActionTypes.INPUT_REFERENCE_REQUEST,
    reference,
  };
};

export const referenceInputFailureAction: ActionCreator<types.signInFindReferenceFailure> = (
  error: RequestError
) => ({
  type: types.SignInActionTypes.INPUT_REFERENCE_FAILURE,
  reference: error,
});

export const referenceInput = (
  online: boolean,
  age: string,
  year: number[],
  rating: number,
  publisher: string
) => {
  return async (dispatch: Dispatch) => {
    try {
      const reference: ReferenceType = {
        online: online,
        age_restriction: Number(age),
        year_of_manufacture: year,
        rating: rating,
        publisher: publisher,
      };
      dispatch(referenceInputRequestAction(reference));
      console.log('gre');
    } catch (error) {
      console.log(error);
      dispatch(referenceInputFailureAction(error));
    }
  };
};

interface IReference {
  online: boolean;
  age_restriction: number;
  year_of_manufacture: number[];
  rating: number;
  publisher: string;
}

interface ISample {
  online: boolean;
  age_restriction: number;
  year_of_manufacture: number;
  rating: number;
  number_of_games_in_the_series: number;
  publisher: string;
}

const arrMult = (arr1: number[], arr2: number[]) => {
  const result = arr1.map((item, index) => {
    return item * arr2[index];
  });

  return result;
};

const normalization = (
  reference: IReference | any,
  sample: ISample | any,
  weight: number[]
) => {
  let resReference = [];
  let resSample = [];

  let ageScale = [0, 14, 16, 18, 21];

  for (let item in reference) {
    switch (item) {
      case 'online':
        if (reference[item] === sample[item]) {
          resReference.push(1);
          resSample.push(1);
        } else {
          resReference.push(1);
          resSample.push(-1);
        }
        break;

      case 'age_restriction':
        resReference.push((ageScale.indexOf(reference[item]) + 1) / 5);
        resSample.push((ageScale.indexOf(sample[item]) + 1) / 5);
        break;

      case 'year_of_manufacture':
        if (
          reference[item][0] <= sample[item] &&
          reference[item][1] >= sample[item]
        ) {
          resReference.push(1);
          resSample.push(1);
        } else {
          resReference.push(1);
          resSample.push(-1);
        }
        break;

      case 'rating':
        resReference.push(reference[item] / 100);
        resSample.push(sample[item] / 100);
        break;

      case 'publisher':
        if (reference[item] === sample[item]) {
          resReference.push(1);
          resSample.push(1);
        } else {
          resReference.push(1);
          resSample.push(-1);
        }
        break;

      default:
        console.log('Not found ' + item);
    }
  }

  resReference = arrMult(resReference, weight);
  resSample = arrMult(resSample, weight);

  return [resReference, resSample];
};

const correlationPirson = (item1: number[], item2: number[]) => {
  let avg1 = 0,
    avg2 = 0,
    mul_numerator = 0,
    den_numerator1 = 0,
    den_numerator2 = 0,
    count = item1.length - 1;

  item1.forEach((item: any, index: number) => {
    avg1 += item;
    avg2 += item2[index];
  });

  avg1 /= count;
  avg2 /= count;
  item1.forEach((item: any, index: number) => {
    mul_numerator += (item - avg1) * (item2[index] - avg2);
    den_numerator1 += Math.pow(item - avg1, 2);
    den_numerator2 += Math.pow(item2[index] - avg2, 2);
  });

  const res = mul_numerator / Math.pow(den_numerator1 * den_numerator2, 1 / 2);

  return res;
};

export const searchingRequestAction: ActionCreator<types.searching> = (
  searching: (string | number)[][]
) => {
  return {
    type: types.SignInActionTypes.SEARCHING_REQUEST,
    searching,
  };
};

export const searchingFailureAction: ActionCreator<types.searchingFailure> = (
  error: RequestError
) => ({
  type: types.SignInActionTypes.SEARCHING_FAILURE,
  searching: error,
});

export const searching = () => {
  return (dispatch: Dispatch, getState: () => AppState) => {
    try {
      const reference = getState().signIn.reference;

      const lengthNodes = data_nodes.length;

      let weight = [1, 1, 0.8, 0.5, 0.3];

      let arrCorrelation = [];

      for (let i = 40; i < lengthNodes; i++) {
        const normalizationVectors = normalization(
          reference,
          data_nodes[i]['signs'],
          weight
        );

        arrCorrelation.push([
          data_nodes[i]['title'],
          correlationPirson(normalizationVectors[0], normalizationVectors[1]),
        ]);
      }

      const res = arrCorrelation
        .sort((a, b) => {
          if (a[1] > b[1]) {
            return 1;
          }
          if (a[1] < b[1]) {
            return -1;
          }
          return 0;
        })
        .slice(-5)
        .reverse();

      dispatch(searchingRequestAction(res));
    } catch (error) {
      console.log(error);
      dispatch(searchingFailureAction(error));
    }
  };
};
