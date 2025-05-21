import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface IThread {
  data: any
  threadName: string;
  threadId: string;
  charmLocation: string;
  imageUrl?: string;  // Add imageUrl field here
}

interface IUploadImageResponse {
  success: boolean;
  imageUrl: string;
  message?: string;
}
interface ThreadResponse {
  data: any;
  isSuccess: boolean;
  message: string;
  statusCode: number;
}

export const threadApi = createApi({
  reducerPath: 'threadApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL + '/threads',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Thread'],
  endpoints: (builder) => ({
    // 🔹 Get all threads
    getThreads: builder.query<{ data: ThreadResponse }, { page_number: number; page_size: number }>({
        query: ({ page_number, page_size }) => `/getall?page_number=${page_number}&page_size=${page_size}`, // Include pagination in the query
        providesTags: ['Thread'],
      }),

    // 🔹 Get a thread by ID
    getThreadById: builder.query<IThread, string>({
      query: (id) => `${id}`,
      providesTags: (result, error, id) => [{ type: 'Thread', id }],
    }),

    // 🔹 Create a new thread
    addThread: builder.mutation<IThread, Partial<IThread>>({
      query: (body) => ({
        url: 'create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Thread'],
    }),

    // 🔹 Update thread
    updateThread: builder.mutation<IThread, { id: string; body: Partial<IThread> }>({
      query: ({ id, body }) => ({
        url: `updateThread/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Thread', id }],
    }),

    // 🔹 Delete thread
    deleteThread: builder.mutation<void, string>({
      query: (id) => ({
        url: `deleteThread/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Thread'],
    }),

    // 🔹 Upload image to thread
    uploadThreadImage: builder.mutation<IUploadImageResponse, { threadId: string; formData: FormData }>({
        query: ({ threadId, formData }) => ({
          url: `uploadImage/${threadId}`,
          method: 'POST',
          body: formData,
          // Don't set Content-Type header - let browser set it with boundary
        }),
        invalidatesTags: (result, error, { threadId }) => [{ type: 'Thread', id: threadId }],
      }),
  }),
});

export const {
  useGetThreadsQuery,
  useGetThreadByIdQuery,
  useAddThreadMutation,
  useUpdateThreadMutation,
  useDeleteThreadMutation,
  useUploadThreadImageMutation,
} = threadApi;
