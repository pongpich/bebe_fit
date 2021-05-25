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
  GET_DAILY_TEAM_WEIGHT_BONUS_SUCCESS: "GET_DAILY_TEAM_WEIGHT_BONUS_SUCCESS",
  GET_DAILY_WEIGH_CHALLENGE: "GET_DAILY_WEIGH_CHALLENGE",
  GET_DAILY_WEIGH_CHALLENGE_SUCCESS: "GET_DAILY_WEIGH_CHALLENGE_SUCCESS",
  POST_DAILY_WEIGH_CHALLENGE: "POST_DAILY_WEIGH_CHALLENGE",
  POST_DAILY_WEIGH_CHALLENGE_SUCCESS: "POST_DAILY_WEIGH_CHALLENGE_SUCCESS",
  GET_NUMBER_OF_TEAM_NOT_FULL: "GET_NUMBER_OF_TEAM_NOT_FULL",
  GET_NUMBER_OF_TEAM_NOT_FULL_SUCCESS: "GET_NUMBER_OF_TEAM_NOT_FULL_SUCCESS",
  ASSIGN_GROUP_TO_MEMBER: "ASSIGN_GROUP_TO_MEMBER",
  ASSIGN_GROUP_TO_MEMBER_SUCCESS: "ASSIGN_GROUP_TO_MEMBER_SUCCESS",
  CLEAR_CHALLENGES: "CLEAR_CHALLENGES",
  CREATE_CHALLENGE_GROUP: "CREATE_CHALLENGE_GROUP",
  CREATE_CHALLENGE_GROUP_SUCCESS: "CREATE_CHALLENGE_GROUP_SUCCESS",
  LEAVE_TEAM: "LEAVE_TEAM",
  LEAVE_TEAM_SUCCESS: "LEAVE_TEAM_SUCCESS",
  GET_MEMBERS_AND_RANK: "GET_MEMBERS_AND_RANK",
  GET_MEMBERS_AND_RANK_SUCCESS: "GET_MEMBERS_AND_RANK_SUCCESS",
  GET_GROUP_NAME: "GET_GROUP_NAME",
  GET_GROUP_NAME_SUCCESS: "GET_GROUP_NAME_SUCCESS",
  GET_SCORE_OF_TEAM: "GET_SCORE_OF_TEAM",
  GET_SCORE_OF_TEAM_SUCCESS: "GET_SCORE_OF_TEAM_SUCCESS",
  GET_LEADER_BOARD: "GET_LEADER_BOARD",
  GET_LEADER_BOARD_SUCCESS: "GET_LEADER_BOARD_SUCCESS"
}

export const getLeaderboard = () => ({
  type: types.GET_LEADER_BOARD
})

export const getScoreOfTeam = (group_id) => ({
  type: types.GET_SCORE_OF_TEAM,
  payload: {
    group_id
  }
})

export const getGroupName = (group_id) => ({
  type: types.GET_GROUP_NAME,
  payload: {
    group_id
  }
})

export const getMembersAndRank = (group_id) => ({
  type: types.GET_MEMBERS_AND_RANK,
  payload: {
    group_id
  }
})

export const leaveTeam = (user_id) => ({
  type: types.LEAVE_TEAM,
  payload: {
    user_id
  }
})

export const createChallengeGroup = (user_id, group_name, start_date, fb_group) => ({
  type: types.CREATE_CHALLENGE_GROUP,
  payload: {
    user_id,
    group_name,
    start_date,
    fb_group
  }
})

export const clearChallenges = () => ({
  type: types.CLEAR_CHALLENGES
})

export const assignGroupToMember = (user_id, start_date, fb_group) => ({
  type: types.ASSIGN_GROUP_TO_MEMBER,
  payload: {
    user_id,
    start_date,
    fb_group
  }
})

export const getNumberOfTeamNotFull = (fb_group) => ({
  type: types.GET_NUMBER_OF_TEAM_NOT_FULL,
  payload: {
    fb_group
  }
})

export const postDailyWeighChallenge = (user_id, weight) => ({
  type: types.POST_DAILY_WEIGH_CHALLENGE,
  payload: {
    user_id,
    weight
  }
});

export const getDailyWeighChallenge = (user_id) => ({
  type: types.GET_DAILY_WEIGH_CHALLENGE,
  payload: {
    user_id
  }
});

export const getDailyTeamWeightBonus = (user_id) => ({
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

const getNumberOfTeamNotFullSagaAsync = async (
  fb_group
) => {
  try {
    const apiResult = await API.get("bebe", "/getNumberOfTeamNotFull", {
      queryStringParameters: {
        fb_group
      }
    });
    return apiResult
  } catch (error) {
    console.log("error :", error);
    return { error, messsage: error.message }
  }
}

const getLeaderboardSagaAsync = async (

) => {
  try {
    const apiResult = await API.get("bebe", "/getLeaderboard", {
      queryStringParameters: {
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

const getDailyWeighChallengeSagaAsync = async (
  user_id
) => {
  try {
    const apiResult = await API.get("bebe", "/getDailyWeighChallenge", {
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

const postDailyWeighChallengeSagaAsync = async (
  user_id,
  weight
) => {
  try {
    const apiResult = await API.post("bebe", "/daily_weight_score", {
      body: {
        user_id,
        weight
      }
    });
    return apiResult
  } catch (error) {
    console.log("error :", error);
    return { error, messsage: error.message }
  }
}

const assignGroupToMemberSagaAsync = async (
  user_id,
  start_date,
  fb_group
) => {
  try {
    const apiResult = await API.post("bebe", "/assignGroupToMember", {
      body: {
        user_id,
        start_date,
        fb_group
      }
    });
    return apiResult
  } catch (error) {
    console.log("error :", error);
    return { error, messsage: error.message }
  }
}

const createChallengeGroupSagaAsync = async (
  user_id,
  group_name,
  start_date,
  fb_group
) => {
  try {
    const apiResult = await API.post("bebe", "/createChallengeGroup", {
      body: {
        user_id,
        group_name,
        start_date,
        fb_group
      }
    });
    return apiResult
  } catch (error) {
    console.log("error :", error);
    return { error, messsage: error.message }
  }
}

const leaveTeamSagaAsync = async (
  user_id
) => {
  try {
    const apiResult = await API.post("bebe", "/leaveTeam", {
      body: {
        user_id
      }
    });
    return apiResult
  } catch (error) {
    console.log("error :", error);
    return { error, messsage: error.message }
  }
}

const getMembersAndRankSagaAsync = async (
  group_id
) => {
  try {
    const apiResult = await API.get("bebe", "/getMembersAndRank", {
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

const getGroupNameSagaAsync = async (
  group_id
) => {
  try {
    const apiResult = await API.get("bebe", "/getGroupName", {
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

const getScoreOfTeamSagaAsync = async (
  group_id
) => {
  try {
    const apiResult = await API.get("bebe", "/getScoreOfTeam", {
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

function* getNumberOfTeamNotFullSaga({ payload }) {
  const {
    fb_group
  } = payload
  try {
    const apiResult = yield call(
      getNumberOfTeamNotFullSagaAsync,
      fb_group
    );
    yield put({
      type: types.GET_NUMBER_OF_TEAM_NOT_FULL_SUCCESS,
      payload: Number(apiResult.results.numberOfTeamNotFull)
    })
  } catch (error) {
    console.log("error from getNumberOfTeamNotFullSaga :", error);
  }
}

function* getLeaderboardSaga() {
  try {
    const apiResult = yield call(
      getLeaderboardSagaAsync
    );
    yield put({
      type: types.GET_LEADER_BOARD_SUCCESS,
      payload: apiResult.results
    })
  } catch (error) {
    console.log("error from getLeaderboardSaga :", error);
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
    console.log("error from getIsReducedWeightSaga :", error);
  }
}

function* getDailyWeighChallengeSaga({ payload }) {
  const {
    user_id
  } = payload
  try {
    const apiResult = yield call(
      getDailyWeighChallengeSagaAsync,
      user_id
    );
    yield put({
      type: types.GET_DAILY_WEIGH_CHALLENGE_SUCCESS,
      payload: (apiResult.results.dailyWeighChallenge)
    })
  } catch (error) {
    console.log("error from getDailyWeighChallengeSaga :", error);
  }
}

function* postDailyWeighChallengeSaga({ payload }) {
  const {
    user_id,
    weight
  } = payload
  try {
    const apiResult = yield call(
      postDailyWeighChallengeSagaAsync,
      user_id,
      weight
    );
    yield put({
      type: types.POST_DAILY_WEIGH_CHALLENGE_SUCCESS
    })
  } catch (error) {
    console.log("error from postDailyWeighChallengeSaga :", error);
  }
}

function* assignGroupToMemberSaga({ payload }) {
  const {
    user_id,
    start_date,
    fb_group
  } = payload
  try {
    const apiResult = yield call(
      assignGroupToMemberSagaAsync,
      user_id,
      start_date,
      fb_group
    );
    yield put({
      type: types.ASSIGN_GROUP_TO_MEMBER_SUCCESS
    })
  } catch (error) {
    console.log("error from assignGroupToMemberSaga :", error);
  }
}

function* createChallengeGroupSaga({ payload }) {
  const {
    user_id,
    group_name,
    start_date,
    fb_group
  } = payload
  try {
    const apiResult = yield call(
      createChallengeGroupSagaAsync,
      user_id,
      group_name,
      start_date,
      fb_group
    );
    yield put({
      type: types.CREATE_CHALLENGE_GROUP_SUCCESS
    })
  } catch (error) {
    console.log("error from createChallengeGroupSaga :", error);
  }
}

function* leaveTeamSaga({ payload }) {
  const {
    user_id
  } = payload
  try {
    const apiResult = yield call(
      leaveTeamSagaAsync,
      user_id
    );
    yield put({
      type: types.LEAVE_TEAM_SUCCESS
    })
  } catch (error) {
    console.log("error from leaveTeamSaga :", error);
  }
}

function* getMembersAndRankSaga({ payload }) {
  const {
    group_id
  } = payload
  try {
    const apiResult = yield call(
      getMembersAndRankSagaAsync,
      group_id
    );
    yield put({
      type: types.GET_MEMBERS_AND_RANK_SUCCESS,
      payload: apiResult.results.members
    })
  } catch (error) {
    console.log("error from getMembersAndRankSaga :", error);
  }
}

function* getGroupNameSaga({ payload }) {
  const {
    group_id
  } = payload
  try {
    const apiResult = yield call(
      getGroupNameSagaAsync,
      group_id
    );
    yield put({
      type: types.GET_GROUP_NAME_SUCCESS,
      payload: apiResult.results.group_name
    })
  } catch (error) {
    console.log("error from getGroupNameSaga :", error);
  }
}

function* getScoreOfTeamSaga({ payload }) {
  const {
    group_id
  } = payload
  try {
    const apiResult = yield call(
      getScoreOfTeamSagaAsync,
      group_id
    );
    yield put({
      type: types.GET_SCORE_OF_TEAM_SUCCESS,
      payload: apiResult.results.totalScoreOfTeam
    })
  } catch (error) {
    console.log("error from getScoreOfTeamSaga :", error);
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

export function* watchGetDailyWeighChallenge() {
  yield takeEvery(types.GET_DAILY_WEIGH_CHALLENGE, getDailyWeighChallengeSaga)
}

export function* watchPostDailyWeighChallenge() {
  yield takeEvery(types.POST_DAILY_WEIGH_CHALLENGE, postDailyWeighChallengeSaga)
}

export function* watchGetDailyTeamWeightBonus() {
  yield takeEvery(types.GET_DAILY_TEAM_WEIGHT_BONUS, getDailyTeamWeightBonusSaga)
}

export function* watchGetNumberOfTeamNotFull() {
  yield takeEvery(types.GET_NUMBER_OF_TEAM_NOT_FULL, getNumberOfTeamNotFullSaga)
}

export function* watchAssignGroupToMember() {
  yield takeEvery(types.ASSIGN_GROUP_TO_MEMBER, assignGroupToMemberSaga)
}

export function* watchCreateChallengeGroup() {
  yield takeEvery(types.CREATE_CHALLENGE_GROUP, createChallengeGroupSaga)
}

export function* watchLeaveTeam() {
  yield takeEvery(types.LEAVE_TEAM, leaveTeamSaga)
}

export function* watchGetMembersAndRank() {
  yield takeEvery(types.GET_MEMBERS_AND_RANK, getMembersAndRankSaga)
}

export function* watchGetGroupName() {
  yield takeEvery(types.GET_GROUP_NAME, getGroupNameSaga)
}

export function* watchGetScoreOfTeam() {
  yield takeEvery(types.GET_SCORE_OF_TEAM, getScoreOfTeamSaga)
}

export function* watchGetLeaderboard() {
  yield takeEvery(types.GET_LEADER_BOARD, getLeaderboardSaga)
}

export function* saga() {
  yield all([
    fork(watchGetRank),
    fork(watchGetLogWeight),
    fork(watchGetLogWeightTeam),
    fork(watchGetIsReducedWeight),
    fork(watchGetDailyWeighChallenge),
    fork(watchGetDailyTeamWeightBonus),
    fork(watchPostDailyWeighChallenge),
    fork(watchGetNumberOfTeamNotFull),
    fork(watchAssignGroupToMember),
    fork(watchCreateChallengeGroup),
    fork(watchLeaveTeam),
    fork(watchGetMembersAndRank),
    fork(watchGetGroupName),
    fork(watchGetScoreOfTeam),
    fork(watchGetLeaderboard),
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
  dailyWeighChallenge: false,
  statusPostDailyWeighChallenge: "default",
  numberOfTeamNotFull: 0,
  statusGetNumberOfTeamNotFull: "default",
  statusLeaveTeam: "default",
  membersOfTeam: [],
  group_name: "",
  totalScoreOfTeam: 0,
  teamRank: [],
  individualRank: [],
  statusCreateTeam: "default"
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
    case types.GET_NUMBER_OF_TEAM_NOT_FULL:
      return {
        ...state,
        statusGetNumberOfTeamNotFull: "loading"
      }
    case types.GET_NUMBER_OF_TEAM_NOT_FULL_SUCCESS:
      return {
        ...state,
        numberOfTeamNotFull: action.payload,
        statusGetNumberOfTeamNotFull: "success"
      }
    case types.GET_LEADER_BOARD_SUCCESS:
      return {
        ...state,
        teamRank: action.payload.teamRank,
        individualRank: action.payload.individualRank
      }
    case types.ASSIGN_GROUP_TO_MEMBER_SUCCESS:
      return {
        ...state,
        statusGetNumberOfTeamNotFull: "default",
        statusLeaveTeam: "default"
      }
    case types.CREATE_CHALLENGE_GROUP:
      return {
        ...state,
        statusCreateTeam: "loading"
      }
    case types.CREATE_CHALLENGE_GROUP_SUCCESS:
      return {
        ...state,
        statusCreateTeam: "default",
        statusGetNumberOfTeamNotFull: "default",
        statusLeaveTeam: "default"
      }
    case types.LEAVE_TEAM_SUCCESS:
      return {
        ...state,
        statusLeaveTeam: "success"
      }
    case types.GET_IS_REDUCED_WEIGHT_SUCCESS:
      return {
        ...state,
        isReducedWeight: action.payload
      }
    case types.GET_DAILY_WEIGH_CHALLENGE_SUCCESS:
      return {
        ...state,
        dailyWeighChallenge: action.payload,
        statusPostDailyWeighChallenge: "default"
      }
    case types.POST_DAILY_WEIGH_CHALLENGE:
      return {
        ...state,
        statusPostDailyWeighChallenge: "loading"
      }
    case types.POST_DAILY_WEIGH_CHALLENGE_SUCCESS:
      return {
        ...state,
        statusPostDailyWeighChallenge: "success",
        dailyWeighChallenge: false
      }
    case types.GET_MEMBERS_AND_RANK_SUCCESS:
      return {
        ...state,
        membersOfTeam: action.payload
      }
    case types.GET_GROUP_NAME_SUCCESS:
      return {
        ...state,
        group_name: action.payload
      }
    case types.GET_SCORE_OF_TEAM_SUCCESS:
      return {
        ...state,
        totalScoreOfTeam: action.payload
      }
    case types.CLEAR_CHALLENGES:
      return INIT_STATE;
    default:
      return { ...state };
  }
}