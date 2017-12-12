import {combineReducers} from 'redux';
import FileReducer from './reducer-file-dir';
import UserReducer from './reducer-user-functions';

const storeManager = combineReducers({
  FileReducer,UserReducer
});

export default storeManager
