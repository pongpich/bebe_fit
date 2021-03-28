import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { API } from "aws-amplify";

/* ACTION Section */

export const types = {
  GET_RANK: "GET_RANK",
  GET_RANK_SUCCESS: "GET_RANK_SUCCESS",
  GET_LOG_WEIGHT: "GET_LOG_WEIGHT",
  GET_LOG_WEIGHT_SUCCESS: "GET_LOG_WEIGHT_SUCCESS",
  GET_LOG_WEIGHT_TEAM: "GET_LOG_WEIGHT_TEAM",
  GET_LOG_WEIGHT_TEAM_SUCCESS: "GET_LOG_WEIGHT_TEAM_SUCCESS",
  GET_NUMBER_OF_MEMBERS_TEAM: "GET_NUMBER_OF_MEMBERS_TEAM",
  GET_IS_REDUCED_WEIGHT: "GET_IS_REDUCED_WEIGHT",
  GET_IS_REDUCED_WEIGHT_SUCCESS: "GET_IS_REDUCED_WEIGHT_SUCCESS",
  GET_DAILY_TEAM_WEIGHT_BONUS: "GET_DAILY_TEAM_WEIGHT_BONUS",
  GET_DAILY_TEAM_WEIGHT_BONUS_SUCCESS: "GET_DAILY_TEAM_WEIGHT_BONUS_SUCCESS"
}

export const getDailyTeamWeightBonus = ( user_id ) => ({
  type: types.GET_DAILY_TEAM_WEIGHT_BONUS,
  payload: {
    user_id
  }
});

export const getRank = (user_id, start_date) => ({
  type: types.GET_RANK,
  payload: {
    user_id,
    start_date
  }
});

export const getLogWeight = (user_id) => ({
  type: types.GET_LOG_WEIGHT,
  payload: {
    user_id
  }
});

export const getLogWeightTeam = (group_id) => ({
  type: types.GET_LOG_WEIGHT_TEAM,
  payload: {
    group_id
  }
});

export const getIsReducedWeight = (user_id) => ({
  type: types.GET_IS_REDUCED_WEIGHT,
  payload: {
    user_id
  }
});

/* END OF ACTION Section */

/* SAGA Section */

const getRankSagaAsync = async (
  user_id,
  start_date
) => {
  try {
    const apiResult = await API.get("bebe", "/getRank", {
      queryStringParameters: {
        user_id,
        start_date
      }
    });
    return apiResult
  } catch (error) {
    console.log("error :", error);
    return { error, messsage: error.message }
  }
}

const getLogWeightSagaAsync = async (
  user_id
) => {
  try {
    const apiResult = await API.get("bebe", "/getLogWeight", {
      queryStringParameters: {
        user_id
      }
    });
    return apiResult
  } catch (error) {
    console.log("error :", error);
    return { error, messsage: error.message }
  }
}

const getLogWeightTeamSagaAsync = async (
  group_id
) => {
  try {
    const apiResult = await API.get("bebe", "/getLogWeightTeam", {
      queryStringParameters: {
        group_id
      }
    });
    return apiResult
  } catch (error) {
    console.log("error :", error);
    return { error, messsage: error.message }
  }
}

const getIsReducedWeightSagaAsync = async (
  user_id
) => {
  try {
    const apiResult = await API.get("bebe", "/getIsReducedWeight", {
      queryStringParameters: {
        user_id
      }
    });
    return apiResult
  } catch (error) {
    console.log("error :", error);
    return { error, messsage: error.message }
  }
}

const getDailyTeamWeightBonusSagaAsync = async (
  user_id
) => {
  try {
    const apiResult = await API.get("bebe", "/getDailyTeamWeightBonus", {
      queryStringParameters: {
        user_id
      }
    });
    return apiResult
  } catch (error) {
    console.log("error :", error);
    return { error, messsage: error.message }
  }
}

function* getRankSaga({ payload }) {
  const {
    user_id,
    start_date
  } = payload
  try {
    const apiResult = yield call(
      getRankSagaAsync,
      user_id,
      start_date
    );
    yield put({
      type: types.GET_RANK_SUCCESS,
      payload: apiResult.results.start_rank
    })
  } catch (error) {
    console.log("error from getRankSaga :", error);
  }
}

function* getLogWeightSaga({ payload }) {
  const {
    user_id
  } = payload
  try {
    const apiResult = yield call(
      getLogWeightSagaAsync,
      user_id
    );
    yield put({
      type: types.GET_LOG_WEIGHT_SUCCESS,
      payload: Number(apiResult.results.logWeightCount)
    })
  } catch (error) {
    console.log("error from getLogWeightSaga :", error);
  }
}

function* getLogWeightTeamSaga({ payload }) {
  const {
    group_id
  } = payload
  try {
    const apiResult = yield call(
      getLogWeightTeamSagaAsync,
      group_id
    );
    yield put({
      type: types.GET_LOG_WEIGHT_TEAM_SUCCESS,
      payload: Number(apiResult.results.logWeightTeamCount)
    })
    yield put({
      type: types.GET_NUMBER_OF_MEMBERS_TEAM,
      payload: Number(apiResult.results.numberOfMembers)
    })
  } catch (error) {
    console.log("error from getLogWeightTeamSaga :", error);
  }
}

function* getIsReducedWeightSaga({ payload }) {
  const {
    user_id
  } = payload
  try {
    const apiResult = yield call(
      getIsReducedWeightSagaAsync,
      user_id
    );
    yield put({
      type: types.GET_IS_REDUCED_WEIGHT_SUCCESS,
      payload: (apiResult.results.isReducedWeight)
    })
  } catch (error) {
    console.log("error from getLogWeightSaga :", error);
  }
}

function* getDailyTeamWeightBonusSaga({ payload }) {
  const {
    user_id
  } = payload
  try {
    const apiResult = yield call(
      getDailyTeamWeightBonusSagaAsync,
      user_id
    );
    yield put({
      type: types.GET_DAILY_TEAM_WEIGHT_BONUS_SUCCESS,
      payload: Number(apiResult.results.dailyTeamWeightBonusCount)
    })
  } catch (error) {
    console.log("error from getDailyTeamWeightBonusSaga :", error);
  }
}

export function* watchGetRank() {
  yield takeEvery(types.GET_RANK, getRankSaga)
}

export function* watchGetLogWeight() {
  yield takeEvery(types.GET_LOG_WEIGHT, getLogWeightSaga)
}

export function* watchGetLogWeightTeam() {
  yield takeEvery(types.GET_LOG_WEIGHT_TEAM, getLogWeightTeamSaga)
}

export function* watchGetIsReducedWeight() {
  yield takeEvery(types.GET_IS_REDUCED_WEIGHT, getIsReducedWeightSaga)
}

export function* watchGetDailyTeamWeightBonus() {
  yield takeEvery(types.GET_DAILY_TEAM_WEIGHT_BONUS, getDailyTeamWeightBonusSaga)
}

export function* saga() {
  yield all([
    fork(watchGetRank),
    fork(watchGetLogWeight),
    fork(watchGetLogWeightTeam),
    fork(watchGetIsReducedWeight),
    fork(watchGetDailyTeamWeightBonus)
  ]);
}

/* END OF SAGA Section */

/* REDUCER Section */

const INIT_STATE = {
  rank: null,
  logWeightCount: 0,
  isReducedWeight: false,
  logWeightTeamCount: 0,
  numberOfMembers: 0,
  dailyTeamWeightBonusCount: 0,

};

export function reducer(state = INIT_STATE, action) {
  switch (action.type) {
    case types.GET_RANK_SUCCESS:
      return {
        ...state,
        rank: action.payload
      }
    case types.GET_LOG_WEIGHT_SUCCESS:
      return {
        ...state,
        logWeightCount: action.payload
      }
    case types.GET_LOG_WEIGHT_TEAM_SUCCESS:
      return {
        ...state,
        logWeightTeamCount: action.payload
      }
    case types.GET_NUMBER_OF_MEMBERS_TEAM:
      return {
        ...state,
        numberOfMembers: action.payload
      }
    case types.GET_DAILY_TEAM_WEIGHT_BONUS_SUCCESS:
      return {
        ...state,
        dailyTeamWeightBonusCount: action.payload
      }
    case types.GET_IS_REDUCED_WEIGHT_SUCCESS:
      return {
        ...state,
        isReducedWeight: action.payload
      }
    default:
      return { ...state };
  }
}