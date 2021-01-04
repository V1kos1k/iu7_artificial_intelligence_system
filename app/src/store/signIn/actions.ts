import * as types from './actionTypes';
import { ActionCreator, Dispatch } from 'redux';
import { RequestError } from 'redux-api-middleware';
import { AppState } from '../reducers';

import data from '../../data/user_data.json';
import { ProfileType } from '../../types/types';

export const nameInputRequestAction: ActionCreator<types.signInFindName> = (
  name
) => {
  const index = data.findIndex((element) => element.Name === name);

  if (index !== -1)
    return {
      type: types.SignInActionTypes.INPUT_NAME_REQUEST,
      name: name,
      index: index,
      ratingGames: data[index],
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
      // dispatch(nameInputRequestAction('Betty Holiday'));
    } catch (error) {
      dispatch(nameInputFailureAction(error));
    }
  };
};

export const titleInputRequestAction: ActionCreator<types.signInFindTitle> = (
  title,
  ratingGames
) => {
  if (ratingGames[title])
    return {
      type: types.SignInActionTypes.INPUT_TITLE_REQUEST,
      title: title,
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
      // dispatch(titleInputRequestAction('NBA', profile.ratingGames));
    } catch (error) {
      dispatch(titleInputFailureAction(error));
    }
  };
};

export const collaborativeFilteringFailureAction: ActionCreator<types.collaborativeFilteringFailure> = (
  error: RequestError
) => ({
  type: types.SignInActionTypes.COLALABORATIVE_FILTERING_FAILURE,
  collaborativeFiltering: error,
});

// вместо этого используется коэффициент корреляции Пирсона
const evklid = (item1: any, item2: any) => {
  let sumEvklid = 0;

  item1.forEach((item: any, index: number) => {
    if (item[0] !== 'Name') {
      sumEvklid += Math.pow(item[1] - item2[index][1], 2);
    }
  });

  return sumEvklid;
};

const correlationPirson = (item1: [string, any][], item2: [string, any][]) => {
  let avg1 = 0,
    avg2 = 0,
    mul_numerator = 0,
    den_numerator1 = 0,
    den_numerator2 = 0,
    count = item1.length - 1;

  item1.forEach((item: any, index: number) => {
    if (item[0] !== 'Name') {
      avg1 += item[1];
      avg2 += item2[index][1];
    }
  });

  avg1 /= count;
  avg2 /= count;
  item1.forEach((item: any, index: number) => {
    if (item[0] !== 'Name') {
      mul_numerator += (item[1] - avg1) * (item2[index][1] - avg2);
      den_numerator1 += Math.pow(item[1] - avg1, 2);
      den_numerator2 += Math.pow(item2[index][1] - avg2, 2);
    }
  });

  const res = mul_numerator / Math.pow(den_numerator1 * den_numerator2, 1 / 2);

  return res;
};

const correlation = (profile: ProfileType, ratingGames: [string, any][]) => {
  console.log('PROFILE ', profile);

  const resultPirson = data.map((item, index) => {
    const entriesItem = Object.entries(item);

    if (item.Name !== profile.name)
      return [correlationPirson(entriesItem, ratingGames), index];
    else return [0, index];
  });

  // так как в корреляции пирсона отрицательные значения обозначают обратную зависимость
  // в качестве результата берем все что больше 0 или максимальные 10 значений
  return resultPirson.sort().slice(-5);
};

const multiplyingTheScoreByTheCoefficientPirson = (correlation: number[][]) => {
  const multiplyingArray = correlation.map((item) => {
    const entriesItem = Object.entries(data[item[1]]);
    const arrayUserScore = entriesItem.map((element) => {
      if (element[0] !== 'Name')
        return [element[0], Number(element[1]) * item[0]];
      else return ['Name', element[1]];
    });

    return arrayUserScore;
  });

  return multiplyingArray;
};

const summMultiplying = (
  ratingGames: [string, any][],
  multiplying: (string | number)[][][],
  correlationSum: number
) => {
  let newArrGame = [];
  const userCount = multiplying[0].length;

  for (let i = 1; i < userCount; i++) {
    if (ratingGames[i][1] === 0) {
      const res = multiplying.reduce((a, v) => {
        if (v[i][0] === 'Name') return 0;
        return Number(v[i][1]) + a;
      }, 0);

      if (res !== 0)
        newArrGame.push([
          i,
          ratingGames[i][0],
          (res / correlationSum).toFixed(4),
        ]);
    }
  }

  newArrGame = newArrGame.sort((a, b) => {
    if (a[2] > b[2]) {
      return 1;
    }
    if (a[2] < b[2]) {
      return -1;
    }
    return 0;
  });

  return newArrGame.slice(-5);
};

export const collaborativeFilteringAction: ActionCreator<types.collaborativeFiltering> = (
  collaborativeFiltering: (string | number)[][]
) => ({
  type: types.SignInActionTypes.COLALABORATIVE_FILTERING_REQUEST,
  collaborativeFiltering: collaborativeFiltering,
});

export const collaborativeFiltering = () => {
  return (dispatch: Dispatch, getState: () => AppState) => {
    try {
      const profile = getState().signIn.profile;
      const ratingGames = getState().signIn.ratingGames;

      const entriesRatingGames = Object.entries(ratingGames);

      const resultCorrelation = correlation(profile, entriesRatingGames);
      const correlationSum = resultCorrelation.reduce(
        (acc, value) => acc + value[0],
        0
      );

      const resultMultiplying = multiplyingTheScoreByTheCoefficientPirson(
        resultCorrelation
      );
      const res = summMultiplying(
        entriesRatingGames,
        resultMultiplying,
        correlationSum
      ).reverse();

      dispatch(collaborativeFilteringAction(res));
    } catch (error) {
      console.log(error);
      dispatch(titleInputFailureAction(error));
    }
  };
};
