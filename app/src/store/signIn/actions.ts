import * as types from './actionTypes';
import { ActionCreator, Dispatch } from 'redux';
import { RequestError } from 'redux-api-middleware';
import { AppState } from '../reducers';

import data from '../../data/user_data.json';
import { ProfileType } from '../../types/types';

export const nameInputRequestAction: ActionCreator<types.signInFindName> = (
  name
) => {
  const data_keys = Object.keys(data[0]);
  const index = data_keys.findIndex((element) => element === name);

  if (index !== -1)
    return {
      type: types.SignInActionTypes.INPUT_NAME_REQUEST,
      name: name,
    };
  else throw 'Not found';
};

export const nameInputFailureAction: ActionCreator<types.signInFindNameFailure> = (
  error: RequestError
) => ({
  type: types.SignInActionTypes.INPUT_NAME_FAILURE,
  name: error,
});

export const nameInput = (name: string) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(nameInputRequestAction(name));
    } catch (error) {
      dispatch(nameInputFailureAction(error));
    }
  };
};

export const titleInputRequestAction: ActionCreator<types.signInFindTitle> = (
  title
) => {
  const index = data.findIndex((element) => element.Game === title);
  if (index !== -1)
    return {
      type: types.SignInActionTypes.INPUT_TITLE_REQUEST,
      title: title,
      ratingGames: data[index],
      index,
    };

  throw 'Not found';
};

export const titleInputFailureAction: ActionCreator<types.signInFindTitleFailure> = (
  error: RequestError
) => ({
  type: types.SignInActionTypes.INPUT_TITLE_FAILURE,
  title: error,
});

export const titleInput = (title: string) => {
  return async (dispatch: Dispatch, getState: () => AppState) => {
    try {
      const profile = getState().signIn;
      dispatch(titleInputRequestAction(title, profile.ratingGames));
      // dispatch(titleInputRequestAction('Crysis'));
    } catch (error) {
      dispatch(titleInputFailureAction(error));
    }
  };
};

export const filteringFailureAction: ActionCreator<types.filteringFailure> = (
  error: RequestError
) => ({
  type: types.SignInActionTypes.FILTERING_FAILURE,
  filtering: error,
});

const correlationPirson = (item1: [string, any][], item2: [string, any][]) => {
  let avg1 = 0,
    avg2 = 0,
    mul_numerator = 0,
    den_numerator1 = 0,
    den_numerator2 = 0,
    count = item1.length - 1;

  item1.forEach((item: any, index: number) => {
    if (item[0] !== 'Game') {
      avg1 += item[1];
      avg2 += item2[index][1];
    }
  });

  avg1 /= count;
  avg2 /= count;
  item1.forEach((item: any, index: number) => {
    if (item[0] !== 'Game') {
      mul_numerator += (item[1] - avg1) * (item2[index][1] - avg2);
      den_numerator1 += Math.pow(item[1] - avg1, 2);
      den_numerator2 += Math.pow(item2[index][1] - avg2, 2);
    }
  });

  const res = mul_numerator / Math.pow(den_numerator1 * den_numerator2, 1 / 2);

  return res;
};

const correlation = (profile: ProfileType, ratingGames: [string, any][]) => {
  const resultPirson = data.map((item, index) => {
    const entriesItem = Object.entries(item);

    if (item.Game !== profile.title) {
      return [correlationPirson(entriesItem, ratingGames), index];
    } else return [0, index];
  });

  // так как в корреляции пирсона отрицательные значения обозначают обратную зависимость
  // в качестве результата берем все что больше 0
  return resultPirson.filter((item) => item[0] > 0);
};

const avgUserRating = () => {
  const userLength = Object.keys(data[0]).length;
  const gameLength = data.length;
  let arrSum: number[] = Array(userLength).fill(0);
  let arrCount: number[] = Array(userLength).fill(0);

  for (let i = 0; i < gameLength; i++) {
    const entriesUser = Object.entries(data[i]);

    for (let j = 1; j < userLength; j++) {
      if (entriesUser[j][0] !== ' Game') {
        arrSum[j] = arrSum[j] + Number(entriesUser[j][1]);
        if (entriesUser[j][1] !== 0) {
          arrCount[j] = arrCount[j] + 1;
        }
      }
    }
  }

  arrSum = arrSum.map((item, index) => item / arrCount[index]);

  return arrSum;
};

const alignmentValues = (correlation: number[][], avgUser: number[]) => {
  const lengthGame = correlation.length;
  const lengthUser = Object.keys(data[0]).length;

  let arr = [];
  for (let i = 0; i < lengthGame; i++) {
    let arrAlignment = [];
    const entriesUser = Object.entries(data[correlation[i][1]]);
    arrAlignment.push(entriesUser[0][1]);
    for (let j = 1; j < lengthUser; j++) {
      arrAlignment.push(Number(entriesUser[j][1]) - avgUser[j]);
    }
    arr.push(arrAlignment);
  }

  return arr;
};

const avgGameRating = (aligments: (string | number)[][]) => {
  const lengthGame = aligments.length;
  const lengthUser = aligments[0].length;

  let arr = [];
  for (let i = 0; i < lengthGame; i++) {
    let avg = 0;
    for (let j = 1; j < lengthUser; j++) {
      avg += Number(aligments[i][j]);
    }

    avg /= lengthUser - 1;
    arr.push([aligments[i][0], avg.toFixed(4)]);
  }

  return arr;
};

export const filteringAction: ActionCreator<types.filtering> = (
  filtering: (string | number)[][]
) => ({
  type: types.SignInActionTypes.FILTERING_REQUEST,
  filtering: filtering,
});

export const filtering = () => {
  return (dispatch: Dispatch, getState: () => AppState) => {
    try {
      const profile = getState().signIn.profile;
      const ratingGames = getState().signIn.ratingGames;

      const entriesRatingGames = Object.entries(ratingGames);
      const resultCorrelation = correlation(profile, entriesRatingGames);

      // вычислить среднюю оценку каждого пользователя (как пользователь оценивает игры) (нули не учитывать)
      const avgUserScore = avgUserRating();

      // вычесть из каждой оценки пользователя его среднюю оценку (для выравнивания результатов)
      const alignmentOfValues = alignmentValues(
        resultCorrelation,
        avgUserScore
      );

      // вычеслить среднеюю оценку для каждой игры
      const avgGameScore = avgGameRating(alignmentOfValues);

      // результат)
      const res = avgGameScore.sort((a, b) => {
        if (a[1] > b[1]) {
          return 1;
        }
        if (a[1] < b[1]) {
          return -1;
        }
        return 0;
      });

      dispatch(filteringAction(res.slice(0, 5)));
    } catch (error) {
      console.log(error);
      dispatch(titleInputFailureAction(error));
    }
  };
};
