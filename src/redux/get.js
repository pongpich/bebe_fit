import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { API } from "aws-amplify";
/* ACTION Section */

export const types = {
    GET_CHECK_DISPAY_NAME: "GET_CHECK_DISPAY_NAME",
    GET_CHECK_DISPAY_NAME_FALE: "GET_CHECK_DISPAY_NAME_FALE",
    GET_CHECK_DISPAY_NAME_SUCCESS: "GET_CHECK_DISPAY_NAME_SUCCESS",
  }

/* END OF ACTION Section */
export const getCheckDisplayName = (display_name) => ({
    type: types.GET_CHECK_DISPAY_NAME,
    payload: {
      display_name
    }
  })

/* SAGA Section */
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

  export function* saga() {
    yield all([
      fork(watchGetCheckDisplayNameSaga),
    ]);
  }

  /* END OF SAGA Section */

/* REDUCER Section */

const INIT_STATE = {
    statusDisplayName: "default",
  };


export function reducer(state = INIT_STATE, action) {
    switch (action.type) {
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