import * as types from './actionTypes';
import { ActionCreator, Dispatch } from 'redux';
import { RequestError } from 'redux-api-middleware';
import { AppState } from '../reducers';

import data_user from '../../data/user_data_lab3.json';
import data_game from '../../data/user_data.json';
import data_nodes from '../../data/filename_nodes_full.json';
import { ProfileType, ReferenceType } from '../../types/types';
import { title } from 'process';

export const nameInputRequestAction: ActionCreator<types.signInFindName> = (
  name
) => {
  const index = data_user.findIndex((element) => element.Name === name);

  if (index !== -1)
    return {
      type: types.SignInActionTypes.INPUT_NAME_REQUEST,
      name: name,
      index: index,
      ratingGamesGame: data_user[index],
    };
  else throw 'Not found';

  // const data_keys = Object.keys(data_game[0]);
  // const index = data_keys.findIndex((element) => element === name);

  // if (index !== -1)
  //   return {
  //     type: types.SignInActionTypes.INPUT_NAME_REQUEST,
  //     name: name,
  //     ratingGamesGame: data_g
  //   }
  // else throw 'Not found';
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
  const index = data_game.findIndex((element) => element.Game === title);
  if (index !== -1)
    return {
      type: types.SignInActionTypes.INPUT_TITLE_REQUEST,
      title: title,
      ratingGames: data_game[index],
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

const correlationPirsonGame = (
  item1: [string, any][],
  item2: [string, any][]
) => {
  let avg1 = 0,
    avg2 = 0,
    mul_numerator = 0,
    den_numerator1 = 0,
    den_numerator2 = 0,
    count = item1.length - 1;

  item1.forEach((item: any, index: number) => {
    if (item[0] !== 'Game' && item[0] !== 'Name') {
      avg1 += item[1];
      avg2 += item2[index][1];
    }
  });

  avg1 /= count;
  avg2 /= count;
  item1.forEach((item: any, index: number) => {
    if (item[0] !== 'Game' && item[0] !== 'Name') {
      mul_numerator += (item[1] - avg1) * (item2[index][1] - avg2);
      den_numerator1 += Math.pow(item[1] - avg1, 2);
      den_numerator2 += Math.pow(item2[index][1] - avg2, 2);
    }
  });

  const res = mul_numerator / Math.pow(den_numerator1 * den_numerator2, 1 / 2);

  return res;
};

const correlation = (
  profile: ProfileType,
  ratingGames: [string, any][],
  step: string
) => {
  let resultPirson = [];

  if (step === 'Game') {
    resultPirson = data_game.map((item, index) => {
      const entriesItem = Object.entries(item);
      if (item.Game !== profile.title) {
        return [correlationPirsonGame(entriesItem, ratingGames), index];
      } else return [0, index];
    });
  } else {
    ///// в этом случае нужно передавать ratingGamesGame
    resultPirson = data_user.map((item, index) => {
      const entriesItem = Object.entries(item);
      if (item.Name !== profile.name)
        return [correlationPirsonGame(entriesItem, ratingGames), index];
      else return [0, index];
    });
  }

  // так как в корреляции пирсона отрицательные значения обозначают обратную зависимость
  // в качестве результата берем все что больше 0
  return resultPirson.filter((item) => item[0] > 0);
};

const avgUserRating = () => {
  const userLength = Object.keys(data_game[0]).length;
  const gameLength = data_game.length;
  let arrSum: number[] = Array(userLength).fill(0);
  let arrCount: number[] = Array(userLength).fill(0);

  for (let i = 0; i < gameLength; i++) {
    const entriesUser = Object.entries(data_game[i]);

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
  const lengthUser = Object.keys(data_game[0]).length;

  let arr = [];
  for (let i = 0; i < lengthGame; i++) {
    let arrAlignment = [];
    const entriesUser = Object.entries(data_game[correlation[i][1]]);
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

/// нужно передавать ratingGamesGame
const multiplyingTheScoreByTheCoefficientPirson = (correlation: number[][]) => {
  const multiplyingArray = correlation.map((item) => {
    const entriesItem = Object.entries(data_user[item[1]]);
    const arrayUserScore = entriesItem.map((element, index) => {
      if (element[0] !== 'Name')
        return [element[0], Number(element[1]) * item[0]];
      else return ['Name', element[1]];
    });

    return arrayUserScore;
  });

  return multiplyingArray;
};

/// нужно передавать ratingGamesGame
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

  return newArrGame;
};

export const filteringAction: ActionCreator<types.filtering> = (
  filtering: (string | number)[][]
) => ({
  type: types.SignInActionTypes.FILTERING_REQUEST,
  filtering: filtering,
});

const averageOfFiltrations = (
  oriented: (string | number)[][],
  collaborative: (string | number)[][]
) => {
  const orientedLength = oriented.length;
  const collaborativeLength = collaborative.length;

  let arr = [];

  for (let i = 0; i < orientedLength; i++) {
    for (let j = 0; j < collaborativeLength; j++) {
      if (oriented[i][0] === collaborative[j][1]) {
        arr.push([
          oriented[i][0],
          ((Number(oriented[i][1]) + Number(collaborative[j][2])) / 2).toFixed(
            4
          ),
        ]);
      }
    }
  }

  return arr;
};

export const filtering = () => {
  return (dispatch: Dispatch, getState: () => AppState) => {
    try {
      const profile = getState().signIn.profile;
      const ratingGames = getState().signIn.ratingGames;
      const ratingGamesGame = getState().signIn.ratingGamesGame;

      const entriesRatingGames = Object.entries(ratingGames);
      const entriesRatingGamesGame = Object.entries(ratingGamesGame);

      // КОНТЕНТНО-ОРИЕНТИРОВАННАЯ ФИЛЬТРАЦИЯ
      const resultCorrelation = correlation(
        profile,
        entriesRatingGames,
        'Game'
      );

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
      const contentOrientedRes = avgGameScore.sort((a, b) => {
        if (a[1] > b[1]) {
          return 1;
        }
        if (a[1] < b[1]) {
          return -1;
        }
        return 0;
      });

      //////////////
      // КОЛЛАБОРАТИВНАЯ ФИЛЬТРАЦИЯ

      const resultCorrelationCollaborative = correlation(
        profile,
        entriesRatingGamesGame,
        'User'
      );
      const correlationSumCollaborative = resultCorrelationCollaborative.reduce(
        (acc, value) => acc + value[0],
        0
      );

      const resultMultiplyingCollaborative = multiplyingTheScoreByTheCoefficientPirson(
        resultCorrelationCollaborative
      );

      const resCollaborative = summMultiplying(
        entriesRatingGamesGame,
        resultMultiplyingCollaborative,
        correlationSumCollaborative
      ).reverse();

      const avgFiltration = averageOfFiltrations(
        contentOrientedRes,
        resCollaborative
      );

      ///////////////

      dispatch(filteringAction(avgFiltration));
    } catch (error) {
      console.log(error);
      dispatch(titleInputFailureAction(error));
    }
  };
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
  searching: (string | number)[][][]
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
      const filtering = getState().signIn.filtering;

      const lengthNodes = data_nodes.length;
      const lengthFiltering = filtering.length;

      let weight = [1, 1, 0.8, 0.5, 0.3];

      let arrCorrelation = [];

      let arrFiltering = [];
      for (let i = 0; i < lengthFiltering; i++)
        for (let j = 40; j < lengthNodes; j++)
          if (filtering[i][0] === data_nodes[j]['title'])
            arrFiltering.push(data_nodes[j]);

      for (let i = 0; i < lengthFiltering; i++) {
        const normalizationVectors = normalization(
          reference,
          arrFiltering[i]['signs'],
          weight
        );

        arrCorrelation.push([
          arrFiltering[i]['title'],
          correlationPirson(normalizationVectors[0], normalizationVectors[1]),
          arrFiltering[i]['signs'],
        ]);
      }

      const res = arrCorrelation
        .sort((a: any, b: any) => {
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
      console.log(res);

      dispatch(searchingRequestAction(res));
    } catch (error) {
      console.log(error);
      dispatch(searchingFailureAction(error));
    }
  };
};
