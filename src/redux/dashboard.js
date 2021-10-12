import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { API } from "aws-amplify";

/* ACTION Section */

export const types = {
  GET_GAMIFICATION: "GET_GAMIFICATION",
  GET_GAMIFICATION_SUCCESS: "GET_GAMIFICATION_SUCCESS",
}

export const getGamification = (
  season
) => ({
  type: types.GET_GAMIFICATION,
  payload: {
    season
  }
});


/* END OF ACTION Section */

/* SAGA Section */



const getGamificationSagaAsync = async (
  season
) => {
  try {
    const apiResult = await API.get("bebe", "/getGamification", {
      queryStringParameters: {
        season
      }
    });
    return apiResult;
  } catch (error) {
    return { error, messsage: error.message };
  }
}

function* getGamificationSaga({ payload }) {
  const {
    season
  } = payload
  try {
    const apiResult = yield call(
      getGamificationSagaAsync,
      season
    );
    yield put({
      type: types.GET_GAMIFICATION_SUCCESS,
      payload: apiResult.results
    })
  } catch (error) {
    return { error, messsage: error.message };
  }
}

export function* watchGetGamification() {
  yield takeEvery(types.GET_GAMIFICATION, getGamificationSaga)
}

export function* saga() {
  yield all([
    fork(watchGetGamification)
  ]);
}

/* END OF SAGA Section */

/* REDUCER Section */

const INIT_STATE = {
  percentCompleteOfWeightResult: 0,
  percentCompleteOfExerciseComplete: 0,
  percentCompleteOfWeightBonusResult: 0,
  percentCompleteOfWeightTeamComplete: 0,
  percentCompleteOfReducedWeight: 0,
  numberOfMembersInSeason: 0,
  numberOfMembersInEndSeason: 0,
  numberOfMembersNotInGamification: 0
};

export function reducer(state = INIT_STATE, action) {
  switch (action.type) {
    case types.GET_GAMIFICATION_SUCCESS:
      return {
        ...state,
        percentCompleteOfWeightResult: action.payload.percentCompleteOfWeightResult,
        percentCompleteOfExerciseComplete: action.payload.percentCompleteOfExerciseComplete,
        percentCompleteOfWeightBonusResult: action.payload.percentCompleteOfWeightBonusResult,
        percentCompleteOfWeightTeamComplete: action.payload.percentCompleteOfWeightTeamComplete,
        percentCompleteOfReducedWeight: action.payload.percentCompleteOfReducedWeight,
        numberOfMembersInSeason: action.payload.numberOfMembersInSeason,
        numberOfMembersInEndSeason: action.payload.numberOfMembersInEndSeason,
        numberOfMembersNotInGamification: action.payload.numberOfMembersNotInGamification
      };
    default:
      return { ...state };
  }
}