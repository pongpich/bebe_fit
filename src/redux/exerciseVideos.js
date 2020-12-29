import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { API } from "aws-amplify";

/* ACTION Section */

export const types = {
  UPDATE_PLAYTIME: "UPDATE_PLAYTIME",
  UPDATE_PLAYTIME_SUCCESS: "UPDATE_PLAYTIME_SUCCESS",
  UPDATE_PLAYLIST: "UPDATE_PLAYLIST",
  UPDATE_PLAYLIST_SUCCESS: "UPDATE_PLAYLIST_SUCCESS",
  VIDEO_LIST_FOR_USER: "VIDEO_LIST_FOR_USER",
  VIDEO_LIST_FOR_USER_SUCCESS: "VIDEO_LIST_FOR_USER_SUCCESS",
  RANDOM_VIDEO: "RANDOM_VIDEO",
  RANDOM_VIDEO_SUCCESS: "RANDOM_VIDEO_SUCCESS",
  RANDOM_VIDEO_FAIL: "RANDOM_VIDEO_FAIL",
  SELECT_CHANGE_VIDEO: "SELECT_CHANGE_VIDEO",
  SELECT_CHANGE_VIDEO_SUCCESS: "SELECT_CHANGE_VIDEO_SUCCESS",
  SELECT_CHANGE_VIDEO_FAIL: "SELECT_CHANGE_VIDEO_FAIL",
  RESET_STATUS: "RESET_STATUS"
}

export const resetStatus = () => ({
  type: types.RESET_STATUS
})

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

export const updatePlaylist = (user_id, start_date, day_number, playlist, exerciseVideo) => ({
  type: types.UPDATE_PLAYLIST,
  payload: {
    user_id,
    start_date,
    day_number,
    playlist,
    exerciseVideo
  }
})

export const updatePlaytime = (user_id, start_date, day_number, video_number, play_time, exerciseVideo) => ({
  type: types.UPDATE_PLAYTIME,
  payload: {
    user_id,
    start_date,
    day_number,
    video_number,
    play_time,
    exerciseVideo
  }
})

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
    exerciseVideo
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
      payload: exerciseVideo
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

export function* watchUpdatePlaytime() {
  yield takeEvery(types.UPDATE_PLAYTIME, updatePlaytimeSaga)
}

export function* watchUpdatePlaylist() {
  yield takeEvery(types.UPDATE_PLAYLIST, updatePlaylistSaga)
}

export function* watchVideoListForUser() {
  yield takeEvery(types.VIDEO_LIST_FOR_USER, videoListForUserSaga)
}

export function* watchRandomVideo() {
  yield takeEvery(types.RANDOM_VIDEO, randomVideoSaga)
}

export function* watchSelectChangeVideo() {
  yield takeEvery(types.SELECT_CHANGE_VIDEO, selectChangeVideoSaga)
}

export function* saga() {
  yield all([
    fork(watchUpdatePlaytime),
    fork(watchUpdatePlaylist),
    fork(watchVideoListForUser),
    fork(watchRandomVideo),
    fork(watchSelectChangeVideo)
  ]);
}

/* END OF SAGA Section */

/* REDUCER Section */

const INIT_STATE = {
  exerciseVideo: [[], [], [], []],
  status: "default",
  video: {},
  videos: []
};

export function reducer(state = INIT_STATE, action) {
  switch (action.type) {
    case types.UPDATE_PLAYLIST:
      return {
        ...state,
        status: "processing"
      };
    case types.UPDATE_PLAYLIST_SUCCESS:
      return {
        ...state,
        exerciseVideo: action.payload,
        status: "success"
      };
    case types.UPDATE_PLAYTIME_SUCCESS:
      return {
        ...state,
        exerciseVideo: action.payload
      };
    case types.VIDEO_LIST_FOR_USER_SUCCESS:
      return {
        ...state,
        exerciseVideo: action.payload
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
    case types.RESET_STATUS:
      return {
        ...state,
        status: "default"
      };
    default:
      return { ...state };
  }
}