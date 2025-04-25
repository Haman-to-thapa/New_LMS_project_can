import  {combineReducers} from '@reduxjs/toolkit'
import { authApi } from '../featureSlice/api/authApi'
import authReducer from '../featureSlice/api/authSlice'
import { courseApi } from './api/courseApi';
import { purchaseApi } from './api/purchaseApi';

const rootReducer = combineReducers({
  [authApi.reducerPath]:authApi.reducer,
  [courseApi.reducerPath]:courseApi.reducer,
  [purchaseApi.reducerPath]:purchaseApi.reducer,
  auth:authReducer
})


export default rootReducer;