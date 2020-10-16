import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { API } from "aws-amplify";

/* ACTION Section */

export const types = {
  TRIAL_REGISTER: "TRIAL_REGISTER",
  SIGNUP_USER: "SIGNUP_USER",
  SIGNUP_USER_SUCCESS: "SIGNUP_USER_SUCCESS",
  SIGNUP_USER_FAIL: "SIGNUP_USER_FAIL",
  LOGIN_USER: "LOGIN_USER",
  LOGIN_USER_SUCCESS: "LOGIN_USER_SUCCESS",
  LOGIN_USER_FAIL: "LOGIN_USER_FAIL",
  CHECK_USER: "CHECK_USER",
  UPDATE_PROFILE: "UPDATE_PROFILE"
}

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
  type: types.TRIAL_REGISTER,
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
    console.log("success: ", apiResult);
    return apiResult
  } catch (error) {
    console.log("error :", error);
    return { error, messsage: error.message }
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
    console.log("trialRegister : ", apiResult);
  } catch (error) {
    console.log("error from trialRegister :", error);
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
      yield put({
        type: types.LOGIN_USER_SUCCESS,
        payload: loginResult.results.user
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

export function* saga() {
  yield all([
    fork(watchLoginUser),
    fork(watchTrialRegister),
    fork(watchCheckUser),
    fork(watchSignupUser),
    fork(watchUpdateProfile)
  ]);
}

/* END OF SAGA Section */

/* REDUCER Section */

const INIT_STATE = {
  user: null
};

export function reducer(state = INIT_STATE, action) {
  switch (action.type) {
    case types.LOGIN_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return { ...state };
  }
}