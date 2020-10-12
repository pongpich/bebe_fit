import { all } from 'redux-saga/effects';
import { saga as authSagas } from './auth';

export default function* rootSaga(getState) {
  yield all([
    authSagas()
  ]);
}
