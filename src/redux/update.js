import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { API } from "aws-amplify";

/* ACTION Section */

export const types = {
  UPDATE_FITTO_PLANT: "UPDATE_FITTO_PLANT",
  UPDATE_FITTO_PLANT_SUCCESS: "UPDATE_FITTO_PLANT_SUCCESS",
  UPDATE_ADDRESS: "UPDATE_ADDRESS",
  UPDATE_ADDRESS_SUCCESS: "UPDATE_ADDRESS_SUCCESS",
  UPDATE_DISPLAY_NAME: "UPDATE_DISPLAY_NAME",
  UPDATE_DISPLAY_NAME_SUCCESS: "UPDATE_DISPLAY_NAME_SUCCESS",
  UPDATE_DISPLAY_NAME_FAIL: "UPDATE_DISPLAY_NAME_FAIL",
}

export const updateDisplayName = (user_id, display_name) => ({
  type: types.UPDATE_DISPLAY_NAME,
  payload: {
    user_id,
    display_name
  }
})

export const updateFittoPlant = (user_id, data) => ({
  type: types.UPDATE_FITTO_PLANT,
  payload: {
    user_id,
    data
  }
})
export const updateAddress = (user_id, data) => ({
  type: types.UPDATE_ADDRESS,
  payload: {
    user_id,
    data
  }
})

/* END OF ACTION Section */

/* SAGA Section */

const updateFittoPlantSagaAsync = async (
  user_id,
  data
) => {
  try {
    const apiResult = await API.post("bebe", "/updateFittoPlant", {
      body: {
        user_id,
        data
      }
    });
    return apiResult
  } catch (error) {
    return { error, messsage: error.message };
  }
}
const updateAddressSagaAsync = async (
  user_id,
  data
) => {
  try {
    const apiResult = await API.post("bebe", "/updateAddress", {
      body: {
        user_id,
        data
      }
    });
    return apiResult
  } catch (error) {
    return { error, messsage: error.message };
  }
}
const updateDisplayNameSagaAsync = async (
  user_id,
  display_name
) => {
  try {
    const apiResult = await API.post("bebe", "/updateDisplayName", {
      body: {
        user_id,
        display_name
      }
    });
    return apiResult
  } catch (error) {
    return { error, messsage: error.message };
  }
}

/* END OF SAGA Section */

function* updateFittoPlantSaga({ payload }) {
  const {
    user_id,
    data
  } = payload

  try {
    const apiResult = yield call(
      updateFittoPlantSagaAsync,
      user_id,
      data
    );
    yield put({
      type: types.UPDATE_FITTO_PLANT_SUCCESS
    })
    console.log("apiResult  :", apiResult);
  } catch (error) {
    console.log("error from updateFittoPlantSaga :", error);
  }
}

function* updateAddressSaga({ payload }) {
  const {
    user_id,
    data
  } = payload

  try {
    const apiResult = yield call(
      updateAddressSagaAsync,
      user_id,
      data
    );
    yield put({
      type: types.UPDATE_ADDRESS_SUCCESS
    })
    console.log("apiResult  :", apiResult);
  } catch (error) {
    console.log("error from updateFittoPlantSaga :", error);
  }
}

function* updateDisplayNameSaga({ payload }) {
  const {
    user_id,
    display_name
  } = payload

  try {
    const apiResult = yield call(
      updateDisplayNameSagaAsync,
      user_id,
      display_name
    );
    yield put({
      type: types.UPDATE_DISPLAY_NAME_SUCCESS
    })
   /*  if (apiResult.results.message === "new") {
      yield put({
        type: types.UPDATE_DISPLAY_NAME_SUCCESS
      })
    }
    if (apiResult.results.message === "exist") {
      yield put({
        type: types.UPDATE_DISPLAY_NAME_FAIL
      })
    } */
  } catch (error) {
    console.log("error from updateDisplayNameSaga :", error);
  }
}

export function* watchupdateFittoPlant() {
  yield takeEvery(types.UPDATE_FITTO_PLANT, updateFittoPlantSaga)
}
export function* watchupdateAddress() {
  yield takeEvery(types.UPDATE_ADDRESS, updateAddressSaga)
}
export function* watchupdateDisplayName() {
  yield takeEvery(types.UPDATE_DISPLAY_NAME, updateDisplayNameSaga)
}

export function* saga() {
  yield all([
    fork(watchupdateFittoPlant),
    fork(watchupdateAddress),
    fork(watchupdateDisplayName),
  ]);
}

/* REDUCER Section */

const INIT_STATE = {
  fittoPlant: "default",
  statusAddress: "default",
  statusUpdateDisplayName: "default"
};

export function reducer(state = INIT_STATE, action) {
  switch (action.type) {
    case types.UPDATE_DISPLAY_NAME:
      return {
        ...state,
        statusUpdateDisplayName: "loading"
      }
    case types.UPDATE_DISPLAY_NAME_SUCCESS:
      return {
        ...state,
        statusUpdateDisplayName: "success"
      }
    case types.UPDATE_DISPLAY_NAME_FAIL:
      return {
        ...state,
        statusUpdateDisplayName: "fail"
      }
    case types.UPDATE_FITTO_PLANT_SUCCESS:
      return {
        ...state,
        fittoPlant: "success"
      }
    case types.UPDATE_ADDRESS_SUCCESS:
      return {
        ...state,
        statusAddress: "success"
      }
    default:
      return { ...state };
  }
}
