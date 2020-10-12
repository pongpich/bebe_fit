import { combineReducers } from 'redux';
import { reducer as authUser} from './auth';

console.log("authUser is:",authUser)
const reducers = combineReducers({
  authUser: authUser
});

export default reducers;