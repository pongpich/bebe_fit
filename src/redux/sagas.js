import { all } from 'redux-saga/effects';
import { saga as authSagas } from './auth';
import { saga as exerciseVideos} from './exerciseVideos';


export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    exerciseVideos()
  ]);
}
