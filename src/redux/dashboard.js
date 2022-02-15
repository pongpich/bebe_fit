import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { API } from "aws-amplify";

/* ACTION Section */

export const types = {
  GET_GAMIFICATION: "GET_GAMIFICATION",
  GET_GAMIFICATION_SUCCESS: "GET_GAMIFICATION_SUCCESS",
  GET_CHALLENGE_EVENT: "GET_CHALLENGE_EVENT",
  GET_CHALLENGE_EVENT_SUCCESS: "GET_CHALLENGE_EVENT_SUCCESS",
  GET_MEMBERS_EACH_WEEK_IN_SEASON: "GET_MEMBERS_EACH_WEEK_IN_SEASON", 
  GET_MEMBERS_EACH_WEEK_IN_SEASON_SUCCESS: "GET_MEMBERS_EACH_WEEK_IN_SEASON_SUCCESS",
  CLEAR_GAMIFICATION: "CLEAR_GAMIFICATION",
}

export const clearGamification = () => ({
  type: types.CLEAR_GAMIFICATION
})

export const getGamification = (
  season
) => ({
  type: types.GET_GAMIFICATION,
  payload: {
    season
  }
});

export const getChallengeEvent = (

) => ({
  type: types.GET_CHALLENGE_EVENT
});

export const getMembersEachWeekInSeason = (

  ) => ({
    type: types.GET_MEMBERS_EACH_WEEK_IN_SEASON
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

const getChallengeEventSagaAsync = async (
  
) => {
  try {
    const apiResult = await API.get("bebe", "/getChallengeEvent", {
      queryStringParameters: {
      }
    });
    return apiResult;
  } catch (error) {
    return { error, messsage: error.message };
  }
}

const getMembersEachWeekInSeasonSagaAsync = async (
  
  ) => {
    try {
      const apiResult = await API.get("bebe", "/getMembersEachWeekInSeason", {
        queryStringParameters: {
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

function* getChallengeEventSaga({  }) {

  try {
    const apiResult = yield call(
      getChallengeEventSagaAsync,
    );
    yield put({
      type: types.GET_CHALLENGE_EVENT_SUCCESS,
      payload: apiResult.results
    })
  } catch (error) {
    return { error, messsage: error.message };
  }
}



function* getMembersEachWeekInSeasonSaga({  }) {

  try {
    const apiResult = yield call(
      getMembersEachWeekInSeasonSagaAsync,
    );
/* 
    console.log("apiResult",apiResult); */
    yield put({
      type: types.GET_MEMBERS_EACH_WEEK_IN_SEASON_SUCCESS,
      payload: apiResult.results
    })
  } catch (error) {
    return { error, messsage: error.message };
  }
}

export function* watchGetGamification() {
  yield takeEvery(types.GET_GAMIFICATION, getGamificationSaga)
}

export function* watchGetChallengeEvent() {
  yield takeEvery(types.GET_CHALLENGE_EVENT, getChallengeEventSaga)
}

export function* watchGetMembersEachWeekInSeason() {
  yield takeEvery(types.GET_MEMBERS_EACH_WEEK_IN_SEASON, getMembersEachWeekInSeasonSaga)
}

export function* saga() {
  yield all([
    fork(watchGetGamification),
    fork(watchGetChallengeEvent),
    fork(watchGetMembersEachWeekInSeason),
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
  numberOfMembersNotInGamification: 0,
  challengeEvent: null,
  percentOfMembersEachWeek: 0,
  numberOfMembersActiveMoreThan1Week: 0
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
        numberOfMembersActiveMoreThan1Week: action.payload.numberOfMembersActiveMoreThan1Week,
        numberOfMembersNotInGamification: action.payload.numberOfMembersNotInGamification
      };
    case types.GET_CHALLENGE_EVENT_SUCCESS:
      return {
        ...state,
        challengeEvent: action.payload.challengeEvent,
      };
    case types.CLEAR_GAMIFICATION:
      return INIT_STATE;
    default:
      return { ...state };
    case types.GET_MEMBERS_EACH_WEEK_IN_SEASON_SUCCESS:
      return { 
        ...state,
        percentOfMembersEachWeek: action.payload.percentOfMembersEachWeek};

  }
}