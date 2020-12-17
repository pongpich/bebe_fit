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
  UPDATE_PROFILE: "UPDATE_PROFILE",
  UPDATE_PROFILE_SUCCESS: "UPDATE_PROFILE_SUCCESS",
  CREATE_CUSTOM_WEEK_FOR_USER: "CREATE_CUSTOM_WEEK_FOR_USER",
  VIDEO_LIST_FOR_USER: "VIDEO_LIST_FOR_USER",
  VIDEO_LIST_FOR_USER_SUCCESS: "VIDEO_LIST_FOR_USER_SUCCESS",
  LOGOUT_USER: "LOGOUT_USER",
  UPDATE_PLAYTIME: "UPDATE_PLAYTIME",
  UPDATE_PLAYTIME_SUCCESS: "UPDATE_PLAYTIME_SUCCESS",
  LOGIN_TEST: "LOGIN_TEST",
  LOGIN_TEST_NO_USER: "LOGIN_TEST_NO_USER",
  LOGIN_TEST_HAVE_USER_HAVE_PASSWORD: "LOGIN_TEST_HAVE_USER_HAVE_PASSWORD",
  LOGIN_TEST_HAVE_USER_NO_PASSWORD: "LOGIN_TEST_HAVE_USER_NO_PASSWORD",
  SET_PASSWORD: "SET_PASSWORD",
  UPDATE_PLAYLIST: "UPDATE_PLAYLIST",
  UPDATE_PLAYLIST_SUCCESS: "UPDATE_PLAYLIST_SUCCESS",
  RANDOM_VIDEO: "RANDOM_VIDEO",
  RANDOM_VIDEO_SUCCESS: "RANDOM_VIDEO_SUCCESS",
  RANDOM_VIDEO_FAIL: "RANDOM_VIDEO_FAIL",
  SELECT_CHANGE_VIDEO: "SELECT_CHANGE_VIDEO",
  SELECT_CHANGE_VIDEO_SUCCESS: "SELECT_CHANGE_VIDEO_SUCCESS",
  SELECT_CHANGE_VIDEO_FAIL: "SELECT_CHANGE_VIDEO_FAIL"
}

export const selectChangeVideo = (video_id, category) => ({
  type: types.SELECT_CHANGE_VIDEO,
  payload: {
    video_id,
    category
  }
})

export const randomVideo = (video_id, category) => ({
  type: types.RANDOM_VIDEO,
  payload: {
    video_id,
    category
  }
})

export const updatePlaylist = (user_id, start_date, day_number, playlist) => ({
  type: types.UPDATE_PLAYLIST,
  payload: {
    user_id,
    start_date,
    day_number,
    playlist
  }
})

export const setPassword = (email, password) => ({
  type: types.SET_PASSWORD,
  payload: {
    email,
    password
  }
})

export const loginTest = (email) => ({
  type: types.LOGIN_TEST,
  payload: {
    email
  }
})

export const updatePlaytime = (user_id, start_date, day_number, video_number, play_time, newVideo) => ({
  type: types.UPDATE_PLAYTIME,
  payload: {
    user_id,
    start_date,
    day_number,
    video_number,
    play_time,
    newVideo
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

export const createCustomWeekForUser = (user_id, weight, startDate, offset) => ({
  type: types.CREATE_CUSTOM_WEEK_FOR_USER,
  payload: {
    user_id,
    weight,
    startDate,
    offset
  }
});

export const videoListForUser = (
  user_id,
  weight,
  start_date,
  offset) => ({
    type: types.VIDEO_LIST_FOR_USER,
    payload: {
      user_id,
      weight,
      start_date,
      offset
    }
  });

/* END OF ACTION Section */

/* SAGA Section */

const videoListForUserSagaAsync = async (
  user_id,
  weight,
  start_date,
  offset
) => {
  try {
    const apiResult = await API.get("bebe", "/videoListForUser", {
      queryStringParameters: {
        user_id,
        weight,
        start_date,
        offset
      }
    });
    return apiResult
  } catch (error) {
    console.log("error :", error);
    return { error, messsage: error.message }
  }
}

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

const createCustomWeekForUserSagaAsync = async (
  user_id,
  weight,
  startDate,
  offset
) => {
  try {
    const apiResult = await API.post("bebe", "/createCustomWeekForUser", {
      body: {
        user_id,
        weight,
        startDate,
        offset
      }
    });
    return apiResult;
  } catch (error) {
    return { error, messsage: error.message };
  }
}

const updatePlaylistSagaAsync = async (
  user_id,
  start_date,
  day_number,
  playlist
) => {
  try {
    const apiResult = await API.put("bebe", "/playlist", {
      body: {
        user_id,
        start_date,
        day_number,
        playlist
      }
    });
    return apiResult;
  } catch (error) {
    return { error, messsage: error.message };
  }
}

const updatePlaytimeSagaAsync = async (
  user_id,
  start_date,
  day_number,
  video_number,
  play_time
) => {
  try {
    const apiResult = await API.put("bebe", "/play_time", {
      body: {
        user_id,
        start_date,
        day_number,
        video_number,
        play_time
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

const selectChangeVideoSagaAsync = async (
  video_id,
  category
) => {
  try {
    const apiResult = await API.get("bebe", "/selectChangeVideo", {
      queryStringParameters: {
        video_id,
        category
      }
    });
    return apiResult;
  } catch (error) {
    
  }
}

const randomVideoSagaAsync = async (
  video_id,
  category
) => {
  try {
    const apiResult = await API.get("bebe", "/randomVideo", {
      queryStringParameters: {
        video_id,
        category
      }
    });
    return apiResult;
  } catch (error) {
    return { error, messsage: error.message };
  }
}

const loginTestSagaAsync = async (
  email
) => {
  try {
    const apiResult = await API.get("bebe", "/login_test", {
      queryStringParameters: {
        email: email
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

function* updatePlaylistSaga({ payload }) {
  const {
    user_id,
    start_date,
    day_number,
    playlist,
    exerciseVideo
  } = payload
  try {
    const apiResult = yield call(
      updatePlaylistSagaAsync,
      user_id,
      start_date,
      day_number,
      playlist
    );
    let keyDay = "";
    switch (day_number) {
      case 0:
        keyDay = "day1";
        break;
      case 1:
        keyDay = "day2";
        break;
      case 2:
        keyDay = "day3";
        break;
      case 3:
        keyDay = "day4";
        break;
      default:
        break;
    }
    yield put({
      type: types.UPDATE_PLAYLIST_SUCCESS,
      payload: exerciseVideo
    });
    return apiResult;
  } catch (error) {
    return { error, messsage: error.message };
  }
}

function* updatePlaytimeSaga({ payload }) {
  const {
    user_id,
    start_date,
    day_number,
    video_number,
    play_time,
    newVideo
  } = payload
  try {
    const apiResult = yield call(
      updatePlaytimeSagaAsync,
      user_id,
      start_date,
      day_number,
      video_number,
      play_time
    );
    let keyDay = "";
    switch (day_number) {
      case 0:
        keyDay = "day1";
        break;
      case 1:
        keyDay = "day2";
        break;
      case 2:
        keyDay = "day3";
        break;
      case 3:
        keyDay = "day4";
        break;
      default:
        break;
    }
    yield put({
      type: types.UPDATE_PLAYTIME_SUCCESS,
      payload: {
        keyDay,
        video_number,
        newVideo
      }
    });
    return apiResult;
  } catch (error) {
    return { error, messsage: error.message };
  }
}

function* videoListForUserSaga({ payload }) {
  const {
    user_id,
    weight,
    start_date,
    offset
  } = payload
  try {
    const apiResult = yield call(
      videoListForUserSagaAsync,
      user_id,
      weight,
      start_date,
      offset
    );
    if (apiResult.results.length > 0) {
      const activities = JSON.parse(apiResult.results[0].activities);
      yield put({
        type: types.VIDEO_LIST_FOR_USER_SUCCESS,
        payload: activities
      })
    }
  } catch (error) {
    console.log("error form videoListForUserSaga", error);
  }
}

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
    yield put({
      type: types.UPDATE_PROFILE_SUCCESS,
      payload: other_attributes
    })
  } catch (error) {
    console.log("error from updateProfile :", error);
  }
}

function* createCustomWeekForUserSaga({ payload }) {
  const {
    user_id,
    weight,
    startDate,
    offset
  } = payload

  try {
    const apiResult = yield call(
      createCustomWeekForUserSagaAsync,
      user_id,
      weight,
      startDate,
      offset
    );
    console.log("createCustomWeekForUser : ", apiResult);
  } catch (error) {
    console.log("error from createCustomWeekForUser :", error);
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

function* selectChangeVideoSaga({ payload }) {
  const {
    video_id,
    category
  } = payload
  try {
    const apiResult = yield call(
      selectChangeVideoSagaAsync,
      video_id,
      category
    );
    if (apiResult.results.message === "no_video") {
      yield put({
        type: types.SELECT_CHANGE_VIDEO_FAIL
      })
    } else {
      yield put({
        type: types.SELECT_CHANGE_VIDEO_SUCCESS,
        payload: apiResult.results.videos
      })
    }
  } catch (error) {
    return { error, messsage: error.message };
  }
}

function* randomVideoSaga({ payload }) {
  const {
    video_id,
    category
  } = payload
  try {
    const apiResult = yield call(
      randomVideoSagaAsync,
      video_id,
      category
    );
    if (apiResult.results.message === "no_video") {
      console.log("user :", apiResult.results);
      yield put({
        type: types.RANDOM_VIDEO_FAIL,
      })
    } else {
      yield put({
        type: types.RANDOM_VIDEO_SUCCESS,
        payload: apiResult.results.video
      })
    }
  } catch (error) {
    return { error, messsage: error.message };
  }
}

function* loginTestSaga({ payload }) {
  const {
    email
  } = payload
  try {
    const apiResult = yield call(
      loginTestSagaAsync,
      email
    );
    console.log(apiResult);
    if (apiResult.results.message === "no_user") {
      console.log("user :", apiResult.results.user);
      yield put({
        type: types.LOGIN_TEST_NO_USER,
        payload: apiResult.results.user
      })
    } else if (apiResult.results.message === "have_user_have_password") {
      console.log("user :", apiResult.results.user);
      yield put({
        type: types.LOGIN_TEST_HAVE_USER_HAVE_PASSWORD,
        payload: apiResult.results.user
      })
    } else if (apiResult.results.message === "have_user_no_password") {
      console.log("user :", apiResult.results.user);
      yield put({
        type: types.LOGIN_TEST_HAVE_USER_NO_PASSWORD,
        payload: apiResult.results.user
      })
    }
  } catch (error) {
    console.log("error form loginTest", error);
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
        type: types.LOGIN_USER_FAIL,
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

export function* watchCreateCustomWeekForUser() {
  yield takeEvery(types.CREATE_CUSTOM_WEEK_FOR_USER, createCustomWeekForUserSaga)
}

export function* watchVideoListForUser() {
  yield takeEvery(types.VIDEO_LIST_FOR_USER, videoListForUserSaga)
}

export function* watchUpdatePlaytime() {
  yield takeEvery(types.UPDATE_PLAYTIME, updatePlaytimeSaga)
}

export function* watchLoginTest() {
  yield takeEvery(types.LOGIN_TEST, loginTestSaga)
}

export function* watchSetPassword() {
  yield takeEvery(types.SET_PASSWORD, setPasswordSaga)
}

export function* watchUpdatePlaylist() {
  yield takeEvery(types.UPDATE_PLAYLIST, updatePlaylistSaga)
}

export function* watchRandomVideo() {
  yield takeEvery(types.RANDOM_VIDEO, randomVideoSaga)
}

export function* watchSelectChangeVideo() {
  yield takeEvery(types.SELECT_CHANGE_VIDEO, selectChangeVideoSaga)
}

export function* saga() {
  yield all([
    fork(watchLoginUser),
    fork(watchTrialRegister),
    fork(watchCheckUser),
    fork(watchSignupUser),
    fork(watchUpdateProfile),
    fork(watchCreateCustomWeekForUser),
    fork(watchVideoListForUser),
    fork(watchUpdatePlaytime),
    fork(watchLoginTest),
    fork(watchSetPassword),
    fork(watchUpdatePlaylist),
    fork(watchRandomVideo),
    fork(watchSelectChangeVideo)
  ]);
}

/* END OF SAGA Section */

/* REDUCER Section */

const INIT_STATE = {
  user: null,
  exerciseVideo: [[], [], [], []],
  status: "default",
  statusTest: "default",
  video: {},
  videos: []
};

function updateObjectInArray(array, action) {
  return array.map((item, index) => {
    if (index !== action.index) {
      // This isn't the item we care about - keep it as-is
      return item
    }

    // Otherwise, this is the one we want - return an updated value
    return {
      ...item,
      ...action.item
    }
  })
}


export function reducer(state = INIT_STATE, action) {
  switch (action.type) {
    case types.LOGIN_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        status: "success"
      };
    case types.LOGIN_USER_FAIL:
      return {
        ...state,
        user: action.payload,
        status: "fail"
      };
    case types.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          other_attributes: action.payload
        }
      }
    case types.VIDEO_LIST_FOR_USER_SUCCESS:
      return {
        ...state,
        exerciseVideo: action.payload
      };
    case types.LOGOUT_USER:
      return INIT_STATE;
    case types.UPDATE_PLAYLIST_SUCCESS:
      return {
        ...state,
        exerciseVideo: action.payload
      };
    case types.UPDATE_PLAYTIME_SUCCESS:
      return {
        ...state,
        exerciseVideo: {
          ...state.exerciseVideo,
          [action.payload.keyDay]: updateObjectInArray(
            state.exerciseVideo[action.payload.keyDay],
            { index: action.payload.video_number, item: action.payload.newVideo }
          )
        }
      };
    case types.RANDOM_VIDEO_SUCCESS:
      return {
        ...state,
        video: action.payload
      };
    case types.SELECT_CHANGE_VIDEO_SUCCESS:
      return {
        ...state,
        videos: action.payload
      };
    case types.LOGIN_TEST_NO_USER:
      return {
        ...state,
        statusTest: "no_user"
      };
    case types.LOGIN_TEST_HAVE_USER_HAVE_PASSWORD:
      return {
        ...state,
        statusTest: "have_user_have_password"
      };
    case types.LOGIN_TEST_HAVE_USER_NO_PASSWORD:
      return {
        ...state,
        statusTest: "have_user_no_password"
      };
    default:
      return { ...state };
  }
}