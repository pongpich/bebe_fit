import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { API } from "aws-amplify";
/* ACTION Section */

export const types = {
  GET_ALL_MEMBER_STAY_FIT: "GET_ALL_MEMBER_STAY_FIT",
  GET_ALL_MEMBER_STAY_FIT_SUCCESS: "GET_ALL_MEMBER_STAY_FIT_SUCCESS",
  GET_CHECK_DISPAY_NAME: "GET_CHECK_DISPAY_NAME",
  GET_CHECK_DISPAY_NAME_FALE: "GET_CHECK_DISPAY_NAME_FALE",
  GET_CHECK_DISPAY_NAME_SUCCESS: "GET_CHECK_DISPAY_NAME_SUCCESS",
  GET_MEMBER_INFO: "GET_MEMBER_INFO",
  GET_MEMBER_INFO_SUCCESS: "GET_MEMBER_INFO_SUCCESS",
}

/* END OF ACTION Section */
export const getCheckDisplayName = (display_name) => ({
  type: types.GET_CHECK_DISPAY_NAME,
  payload: {
    display_name
  }
})

export const getMemberInfo = (user_id) => ({
  type: types.GET_MEMBER_INFO,
  payload: {
    user_id
  }
})

export const getAllMemberStayFit = () => ({
  type: types.GET_ALL_MEMBER_STAY_FIT
})

/* SAGA Section */
const getAllMemberStayFitSagaAsync = async (

) => {
  try {
    const apiResult = await API.get("bebe", "/getAllMemberStayFit", {
      queryStringParameters: {

      }
    });
    return apiResult
  } catch (error) {
    return { error, messsage: error.message };
  }
}

const getCheckDisplayNameSagaAsync = async (
  display_name
) => {
  try {
    const apiResult = await API.get("bebe", "/checkDisplayName", {
      queryStringParameters: {
        display_name
      }
    });
    return apiResult
  } catch (error) {
    return { error, messsage: error.message };
  }
}

const getMemberInfoSagaAsync = async (
  user_id
) => {
  try {
    const apiResult = await API.get("bebe", "/getMemberInfo", {
      queryStringParameters: {
        user_id
      }
    });
    return apiResult
  } catch (error) {
    return { error, messsage: error.message };
  }
}

function* getAllMemberStayFitSaga({ }) {

  try {
    const apiResult = yield call(
      getAllMemberStayFitSagaAsync
    );
    yield put({
      type: types.GET_ALL_MEMBER_STAY_FIT_SUCCESS,
      payload: apiResult.results
    })
  } catch (error) {
    console.log("error from getAllMemberStayFitSaga :", error);
  }
}

function* getMemberInfoSagaAsyncSaga({ payload }) {
  const {
    user_id
  } = payload

  try {
    const apiResult = yield call(
      getMemberInfoSagaAsync,
      user_id
    );

    yield put({
      type: types.GET_MEMBER_INFO_SUCCESS,
      payload: apiResult.results
    })
  } catch (error) {
    console.log("error from getMemberInfoSagaAsyncSaga :", error);
  }

}

function* getCheckDisplayNameSaga({ payload }) {
  const {
    display_name
  } = payload

  try {
    const apiResult = yield call(
      getCheckDisplayNameSagaAsync,
      display_name
    );

    if (apiResult.results.message === "new") {
      yield put({
        type: types.GET_CHECK_DISPAY_NAME_SUCCESS
      })
    }
    if (apiResult.results.message === "exist") {
      yield put({
        type: types.GET_CHECK_DISPAY_NAME_FALE
      })
    }
  } catch (error) {
    console.log("error from updateDisplayNameSaga :", error);
  }
}

export function* watchGetCheckDisplayNameSaga() {
  yield takeEvery(types.GET_CHECK_DISPAY_NAME, getCheckDisplayNameSaga)
}

export function* watchGetMemberInfoSagaAsyncSaga() {
  yield takeEvery(types.GET_MEMBER_INFO, getMemberInfoSagaAsyncSaga)
}


export function* saga() {
  yield all([
    fork(watchGetCheckDisplayNameSaga),
    fork(watchGetMemberInfoSagaAsyncSaga),
  ]);
}

/* END OF SAGA Section */

/* REDUCER Section */

const INIT_STATE = {
  statusDisplayName: "default",
  statusGetMemberInfo: "default",
  member_info: null,
  allMemberStayFit: null,
};


export function reducer(state = INIT_STATE, action) {
  switch (action.type) {
    case types.GET_ALL_MEMBER_STAY_FIT_SUCCESS:
      return {
        ...state,
        allMemberStayFit: action.payload.allMemberStayFit
      }
    case types.GET_MEMBER_INFO:
      return {
        ...state,
        statusGetMemberInfo: "loading"
      }
    case types.GET_MEMBER_INFO_SUCCESS:
      return {
        ...state,
        member_info: action.payload.member_info,
        statusGetMemberInfo: "success"
      }
    case types.GET_CHECK_DISPAY_NAME:
      return {
        ...state,
        statusDisplayName: "loading"
      }
    case types.GET_CHECK_DISPAY_NAME_SUCCESS:
      return {
        ...state,
        statusDisplayName: "success"
      }
    case types.GET_CHECK_DISPAY_NAME_FALE:
      return {
        ...state,
        statusDisplayName: "fail"
      }
    default:
      return { ...state };
  }
}