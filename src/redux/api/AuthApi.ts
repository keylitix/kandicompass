// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const authApi = createApi({
//   reducerPath: 'authApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: process.env.REACT_APP_API_URL,
//     credentials: 'include',
//   }),
//   endpoints: (builder) => ({
//     login: builder.mutation({
//       query: (credentials) => ({
//         url: '/User/login',
//         method: 'POST',
//         body: credentials,
//       }),
//     }),
//     register: builder.mutation({
//       query: (userData) => ({
//         url: '/User/create',
//         method: 'POST',
//         body: userData,
//       }),
//     }),
//     getMe: builder.query({
//       query: () => '/auth/me',
//     }),
//   }),
// });

// export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;



// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const authApi = createApi({
//   reducerPath: 'authApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: process.env.REACT_APP_API_URL,
//     prepareHeaders: (headers) => {
//       headers.set('Content-Type', 'application/json');
//       return headers;
//     },
//   }),
//   endpoints: (builder) => ({
//     login: builder.mutation({
//       query: (credentials) => ({
//         url: '/User/login',
//         method: 'POST',
//         body: credentials,
//       }),
//     }),
//     register: builder.mutation({
//       query: (userData) => ({
//         url: '/User/create',
//         method: 'POST',
//         body: userData,
//       }),
//     }),
//     getMe: builder.query({
//       query: () => '/auth/me',
//     }),
//       getUserById: builder.query({
//       query: (id) => `/User/getById/${id}`,
//        transformResponse: (response: any) => response.data,
//     }),
//   }),
// });

// export const { useLoginMutation, useRegisterMutation, useGetMeQuery, useGetUserByIdQuery } = authApi;


import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token'); // Get token from storage
      if (token) {
        headers.set('Authorization', `Bearer ${token}`); // Set the auth header
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/User/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/User/create',
        method: 'POST',
        body: userData,
      }),
    }),
    getMe: builder.query({
      query: () => '/auth/me',
    }),
    getUserById: builder.query({
      query: (id) => `/User/getById/${id}`,
      transformResponse: (response) => response.data, // optional: extract `data`
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useGetUserByIdQuery,
} = authApi;
