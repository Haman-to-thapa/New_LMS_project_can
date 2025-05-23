import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { userLoggedIn, userLoggedOut } from './authSlice';
import { API_ENDPOINTS } from '@/config/apiConfig';



export const authApi = createApi({
  reducerPath:"authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_ENDPOINTS.USER_API,
    credentials:"include",
  }),
  endpoints: (builder) => ({
    registerUser : builder.mutation({
      query: (inputData) => ({
        url: "register",
        method:"POST",
        body:inputData
      })
    }),
  loginUser : builder.mutation({
    query: (inputData) => ({
      url: "login",
      method: "POST",
      body:inputData
    }),
    async onQueryStarted(_, {queryFulfilled, dispatch}) {
          try {
            const result = await queryFulfilled;
            dispatch(userLoggedIn({user:result.data.user}))
          } catch (error) {
            console.log(error)
          }
    }
  }),
  logoutUser: builder.mutation({
 query: () => ({
  url:"logout",
  method:"GET"
 }), async onQueryStarted(_,{queryFulfilled, dispatch}) {
  try {
    const result = await queryFulfilled;
    dispatch(userLoggedOut())
  } catch (error) {
    console.log(error)
  }
 }
  }),
  loadUser: builder.query({
    query: () => ({
      url:"profile",
      method:"GET"
    }), async onQueryStarted(_, {queryFulfilled, dispatch}) {
      try {
        const result = await queryFulfilled;
        dispatch(userLoggedIn({user:result.data.user}))
      } catch (error) {
        console.log(error)
      }
    }
  }),
  updateProfileUser: builder.mutation({
    query:(formData) => ({
      url:"profile/update",
      method:"PUT",
      body:formData,
      credentials:"include"
    })
  })

  }),

})

export const {useRegisterUserMutation, useLoginUserMutation, useLogoutUserMutation, useLoadUserQuery, useUpdateProfileUserMutation} = authApi;