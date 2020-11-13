import { combineReducers } from 'redux';
import { reducer as authUser} from './auth';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'


const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: hardSet
};

const reducers = combineReducers({
  authUser: authUser
});

const persistedReducer = persistReducer(persistConfig, reducers)

export default persistedReducer;