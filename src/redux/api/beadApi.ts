import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IBead, IUploadImageResponse } from '../../types/bead';

export const beadApi = createApi({
  reducerPath: 'beadApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL + '/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Bead'],
  endpoints: (builder) => ({
    getBeads: builder.query<{ data: any }, { page_number: number; page_size: number }>({
      query: ({ page_number, page_size }) => `beads/getall?page_number=${page_number}&page_size=${page_size}`,
      providesTags: ['Bead'],
    }),

    getBeadById: builder.query<IBead, string>({
      query: (id) => `beads/${id}`,
      providesTags: (result, error, id) => [{ type: 'Bead', id }],
    }),

    addBead: builder.mutation<IBead, Partial<IBead>>({
      query: (body) => ({
        url: 'beads/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Bead'],
    }),

    updateBead: builder.mutation<IBead, { id: string; body: Partial<IBead> }>({
      query: ({ id, body }) => ({
        url: `beads/updateBead/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Bead', id }],
    }),

    deleteBead: builder.mutation<void, string>({
      query: (id) => ({
        url: `beads/deleteBead/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bead'],
    }),

    uploadBeadImage: builder.mutation<IUploadImageResponse, { beadId: string; formData: FormData }>({
      query: ({ beadId, formData }) => ({
        url: `beads/uploadImage/${beadId}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { beadId }) => [{ type: 'Bead', id: beadId }],
    }),

    uploadBeadImages: builder.mutation<any, { beadId: string; formData: FormData }>({
      query: ({ beadId, formData }) => ({
        url: `beads/uploadImages/${beadId}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { beadId }) => [{ type: 'Bead', id: beadId }],
    }),

    // Combined create bead with image upload
    createBeadWithImage: builder.mutation<IBead, { beadData: Partial<IBead>; imageFile: File | null }>({
      async queryFn({ beadData, imageFile }, api, extraOptions, baseQuery) {
        // Step 1: Create the bead
        const beadResult = await baseQuery({
          url: 'beads/create',
          method: 'POST',
          body: beadData,
        });

        if (beadResult.error) {
          return { error: beadResult.error };
        }

        const newBead = beadResult.data as IBead;

        // Step 2: If image was provided, upload it
        if (imageFile && newBead._id) {
          const formData = new FormData();
          formData.append('image', imageFile);

          const imageResult = await baseQuery({
            url: `beads/uploadImage/${newBead._id}`,
            method: 'POST',
            body: formData,
          });

          if (imageResult.error) {
            return { error: imageResult.error };
          }

          // Update the bead with the image URL if needed
          const imageResponse = imageResult.data as IUploadImageResponse;
          if (imageResponse.imageUrl) {
            await baseQuery({
              url: `beads/updateBead/${newBead._id}`,
              method: 'PUT',
              body: { imageUrl: imageResponse.imageUrl },
            });
          }
        }

        return { data: newBead };
      },
      invalidatesTags: ['Bead'],
    }),
  }),
});

export const {
  useGetBeadsQuery,
  useGetBeadByIdQuery,
  useAddBeadMutation,
  useUpdateBeadMutation,
  useDeleteBeadMutation,
  useUploadBeadImageMutation,
  useUploadBeadImagesMutation,
  useCreateBeadWithImageMutation,
} = beadApi;