import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
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
      transformResponse: (response) => response.data,
    }),
     updateUser: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/User/update/${id}`,
        method: 'PUT',
        body: updatedData,
      }),
    }),
    getAllUsers: builder.query({
  query: ({ pageNo = 1, pageSize = 100 }) => ({
    url: '/User/getall',
    method: 'GET',
    params: {
      page_no: pageNo,
      page_size: pageSize,
    },
  }),
  transformResponse: (response) => response.data, // Adjust according to your API response structure
}),


  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
    useGetAllUsersQuery, 
} = authApi;
