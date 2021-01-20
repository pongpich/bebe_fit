import { all } from 'redux-saga/effects';
import { saga as authSagas } from './auth';
import { saga as exerciseVideos} from './exerciseVideos';
import { saga as exerciseProgram} from './exerciseProgram';
import { saga as payment} from './payment';


export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    exerciseVideos(),
    exerciseProgram(),
    payment()
  ]);
}
