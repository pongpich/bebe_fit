import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { API } from "aws-amplify";

/* ACTION Section */

export const types = {
  GET_RANK: "GET_RANK",
  GET_RANK_SUCCESS: "GET_RANK_SUCCESS"
}

export const getRank = (user_id, start_date) => ({
  type: types.GET_RANK,
  payload: {
    user_id,
    start_date
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

export function* watchGetRank() {
  yield takeEvery(types.GET_RANK, getRankSaga)
}

export function* saga() {
  yield all([
    fork(watchGetRank)
  ]);
}

/* END OF SAGA Section */

/* REDUCER Section */

const INIT_STATE = {
  rank: null
};

export function reducer(state = INIT_STATE, action) {
  switch (action.type) {
    case types.GET_RANK_SUCCESS:
      return {
        ...state,
        rank: action.payload
      }
    default:
      return { ...state };
  }
}