import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';

import { reducer as authUser} from './auth';
import { reducer as exerciseVideos} from './exerciseVideos';


const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: hardSet
};

const reducers = combineReducers({
  authUser,
  exerciseVideos
});

const persistedReducer = persistReducer(persistConfig, reducers)

export default persistedReducer;