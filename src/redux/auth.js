import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { API } from "aws-amplify";

/* ACTION Section */

export const types = {
  TRIAL_REGISTER: "TRIAL_REGISTER",
  TRIAL_REGISTER_SUCCESS: "TRIAL_REGISTER_SUCCESS",
  SIGNUP_USER: "SIGNUP_USER",
  LOGIN_USER: "LOGIN_USER",
  LOGIN_USER_SUCCESS: "LOGIN_USER_SUCCESS",
  LOGIN_USER_FAIL: "LOGIN_USER_FAIL",
  CHECK_USER: "CHECK_USER",
  CHECK_USER_SUCCESS: "CHECK_USER_SUCCESS",
  UPDATE_PROFILE: "UPDATE_PROFILE",
  UPDATE_PROFILE_SUCCESS: "UPDATE_PROFILE_SUCCESS",
  LOGOUT_USER: "LOGOUT_USER",
  SET_PASSWORD: "SET_PASSWORD",
  TRIAL_PACKAGE: "TRIAL_PACKAGE",
  TRIAL_PACKAGE_SUCCESS: "TRIAL_PACKAGE_SUCCESS",
  GET_EXPIRE_DATE: "GET_EXPIRE_DATE",
  GET_EXPIRE_DATE_SUCCESS: "GET_EXPIRE_DATE_SUCCESS"
}

export const getExpireDate = (email) => ({
  type: types.GET_EXPIRE_DATE,
  payload: {
    email
  }
})

export const trialPackage = (email, expire_date) => ({
  type: types.TRIAL_PACKAGE,
  payload: {
    email,
    expire_date
  }
})

export const setPassword = (email, password) => ({
  type: types.SET_PASSWORD,
  payload: {
    email,
    password
  }
})

export const logoutUser = () => ({
  type: types.LOGOUT_USER
});

export const checkUser = (email) => ({
  type: types.CHECK_USER,
  payload: {
    email
  }
});

export const loginUser = (email, password) => ({
  type: types.LOGIN_USER,
  payload: {
    email,
    password
  }
});

export const updateProfile = (
  email,
  other_attributes) => ({
    type: types.UPDATE_PROFILE,
    payload: {
      email,
      other_attributes
    }
  });

export const trialRegister = (email, password, firstname, lastname, phone) => ({
  type: types.TRIAL_REGISTER,
  payload: {
    email,
    password,
    firstname,
    lastname,
    phone
  }
});

export const signupUser = (email, password, firstname, lastname, phone) => ({
  type: types.SIGNUP_USER,
  payload: {
    email,
    password,
    firstname,
    lastname,
    phone
  }
});

/* END OF ACTION Section */

/* SAGA Section */

const checkUserSagaAsync = async (
  email
) => {
  try {
    const apiResult = await API.get("bebe", "/check_user", {
      queryStringParameters: {
        email: email
      }
    });
    return apiResult
  } catch (error) {
    console.log("error :", error);
    return { error, messsage: error.message }
  }
}

const setPasswordSagaAsync = async (
  email,
  password
) => {
  try {
    const apiResult = await API.put("bebe", "/setPassword", {
      body: {
        email: email,
        password: password,
      }
    });
    return apiResult;
  } catch (error) {
    return { error, messsage: error.message };
  }
};

const trialPackageSagaAsync = async (
  email
) => {
  try {
    const apiResult = await API.put("bebe", "/trialPackage", {
      body: {
        email: email,
      }
    });
    return apiResult;
  } catch (error) {
    return { error, messsage: error.message };
  }
}

const trialRegisterSagaAsync = async (
  email,
  password,
  firstname,
  lastname,
  phone
) => {
  try {
    const apiResult = await API.post("bebe", "/trial_signup", {
      body: {
        email: email,
        password: password,
        first_name: firstname,
        last_name: lastname,
        phone: phone
      }
    });
    return apiResult;
  } catch (error) {
    return { error, messsage: error.message };
  }
};

const updateProfileSagaAsync = async (
  email,
  other_attributes
) => {
  try {
    const apiResult = await API.post("bebe", "/updateProfile", {
      body: {
        email: email,
        other_attributes
      }
    });
    return apiResult;
  } catch (error) {
    return { error, messsage: error.message };
  }
}

const signupUserSagaAsync = async (
  email,
  password,
  firstname,
  lastname,
  phone
) => {
  try {
    const apiResult = await API.post("bebe", "/signup", {
      body: {
        email: email,
        password: password,
        first_name: firstname,
        last_name: lastname,
        phone: phone
      }
    });
    return apiResult;
  } catch (error) {
    return { error, messsage: error.message };
  }
};

const getExpireDateSagaAsync = async (
  email
) => {
  try {
    const apiResult = await API.get("bebe", "/getExpireDate", {
      queryStringParameters: {
        email
      }
    });
    return apiResult
  } catch (error) {
    return { error, messsage: error.message };
  }
}

const loginUserSagaAsync = async (
  email,
  password
) => {
  try {
    const apiResult = await API.get("bebe", "/login", {
      queryStringParameters: {
        email: email,
        password: password
      }
    });
    return apiResult
  } catch (error) {
    return { error, messsage: error.message };
  }
};





function* checkUserSaga({ payload }) {
  const {
    email
  } = payload

  try {
    const apiResult = yield call(
      checkUserSagaAsync,
      email
    );
    yield put ({
      type: types.CHECK_USER_SUCCESS,
      payload: apiResult.results.message
    })
  } catch (error) {
    console.log("error from checkUserSaga :", error);
  }
}

function* updateProfileSaga({ payload }) {
  const {
    email,
    other_attributes
  } = payload

  try {
    const apiResult = yield call(
      updateProfileSagaAsync,
      email,
      other_attributes
    );
    yield put({
      type: types.UPDATE_PROFILE_SUCCESS,
      payload: other_attributes
    })
  } catch (error) {
    console.log("error from updateProfile :", error);
  }
}

function* signupUserSaga({ payload }) {
  const {
    email,
    password,
    firstname,
    lastname,
    phone
  } = payload

  try {
    const apiResult = yield call(
      signupUserSagaAsync,
      email,
      password,
      firstname,
      lastname,
      phone
    );
    console.log("signupUser : ", apiResult);
  } catch (error) {
    console.log("error from signupUser :", error);
  }
}

function* setPasswordSaga({ payload }) {
  const {
    email,
    password
  } = payload

  try {
    const apiResult = yield call(
      setPasswordSagaAsync,
      email,
      password
    );
    console.log("setPasswordSaga : ", apiResult);
  } catch (error) {
    console.log("error from setPasswordSaga :", error);
  }
}

function* trialPackageSaga({ payload }) {
  const {
    email,
    expire_date
  } = payload

  try {
    const apiResult = yield call (
      trialPackageSagaAsync,
      email
    );
    yield put({
      type: types.TRIAL_PACKAGE_SUCCESS,
      payload: expire_date
    })
  } catch (error) {
    console.log("error from trialPackageSaga :", error);
  }
}

function* trialRegisterSaga({ payload }) {
  const {
    email,
    password,
    firstname,
    lastname,
    phone
  } = payload

  try {
    const apiResult = yield call(
      trialRegisterSagaAsync,
      email,
      password,
      firstname,
      lastname,
      phone
    );
    yield put({
      type: types.TRIAL_REGISTER_SUCCESS
    })
  } catch (error) {
    console.log("error from trialRegister :", error);
  }
}

function* getExpireDateSaga({ payload }) {
  const {
    email
  } = payload

  try {
    const apiResult = yield call(
      getExpireDateSagaAsync,
      email
    );
    yield put({
      type: types.GET_EXPIRE_DATE_SUCCESS,
      payload: apiResult.results.expire_date
    })
  } catch (error) {
    console.log("error from getExpireDateSaga :", error);

  }
}

function* loginUserSaga({ payload }) {
  const {
    email,
    password
  } = payload

  try {
    const loginResult = yield call(
      loginUserSagaAsync,
      email,
      password
    );
    console.log(loginResult);
    if (loginResult.results.message === "success") {
      console.log("user :", loginResult.results.user);
      yield put({
        type: types.LOGIN_USER_SUCCESS,
        payload: loginResult.results.user
      })
    } else if (loginResult.results.message === "fail" || loginResult.results.message === "no_user") {
      console.log("user :", loginResult.results.user);
      yield put({
        type: types.LOGIN_USER_FAIL
      })
    }
  } catch (error) {
    console.log("error form login", error);
  }
}

export function* watchCheckUser() {
  yield takeEvery(types.CHECK_USER, checkUserSaga)
}

export function* watchLoginUser() {
  yield takeEvery(types.LOGIN_USER, loginUserSaga)
}

export function* watchSignupUser() {
  yield takeEvery(types.SIGNUP_USER, signupUserSaga);
}

export function* watchTrialRegister() {
  yield takeEvery(types.TRIAL_REGISTER, trialRegisterSaga)
}

export function* watchUpdateProfile() {
  yield takeEvery(types.UPDATE_PROFILE, updateProfileSaga)
}

export function* watchSetPassword() {
  yield takeEvery(types.SET_PASSWORD, setPasswordSaga)
}

export function* watchTrialPackage() {
  yield takeEvery(types.TRIAL_PACKAGE, trialPackageSaga)
}

export function* watchGetExpireDate() {
  yield takeEvery(types.GET_EXPIRE_DATE, getExpireDateSaga)
}
export function* saga() {
  yield all([
    fork(watchLoginUser),
    fork(watchTrialRegister),
    fork(watchCheckUser),
    fork(watchSignupUser),
    fork(watchUpdateProfile),
    fork(watchSetPassword),
    fork(watchTrialPackage),
    fork(watchGetExpireDate)
  ]);
}

/* END OF SAGA Section */

/* REDUCER Section */

const INIT_STATE = {
  user: null,
  status: "default",
  statusRegister: "default"
};

export function reducer(state = INIT_STATE, action) {
  switch (action.type) {
    case types.GET_EXPIRE_DATE_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          expire_date: action.payload
        }
      }
    case types.CHECK_USER_SUCCESS:
      return {
        ...state,
        statusRegister: action.payload
      }
    case types.LOGIN_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        status: "success",
        statusRegister: "default"
      };
    case types.LOGIN_USER_FAIL:
      return {
        ...state,
        status: "fail",
        statusRegister: "default"
      };
    case types.TRIAL_REGISTER_SUCCESS:
      return {
        ...state,
        statusRegister: "success"
      }
    case types.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          other_attributes: action.payload
        }
      }
    case types.TRIAL_PACKAGE_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          expire_date: action.payload
        }
      };
    case types.LOGOUT_USER:
      return INIT_STATE;
    default:
      return { ...state };
  }
}