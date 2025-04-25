import {configureStore} from '@reduxjs/toolkit'
import rootReducer from '@/featureSlice/routeReducer';
import { authApi } from '@/featureSlice/api/authApi';
import { courseApi } from '@/featureSlice/api/courseApi';
import { purchaseApi } from '@/featureSlice/api/purchaseApi';


export const store = configureStore({
  reducer : rootReducer,
  middleware:(defaultMiddleware) => defaultMiddleware().concat(authApi.middleware, courseApi.middleware, purchaseApi.middleware)
})


// set set not remove user page by server without logout
const initializeApp = async () => {
  await store.dispatch(authApi.endpoints.loadUser.initiate({}, {forceRefetch: true}))
}
initializeApp()