import { baseApi } from '../baseApi';

interface User {
  _id: string;
  name: string;
  email: string;
  location: string;
  tempUnit: 'F' | 'C';
  windUnit: 'mph' | 'kmh';
}

interface UpdateUserPayload {
  id: string;
  name?: string;
  location?: string;
  tempUnit?: 'F' | 'C';
  windUnit?: 'mph' | 'kmh';
  // other updatable fields can be added here
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<User, string>({
      query: (id) => `users/${id}`,
      providesTags: ['User'],
    }),
    updateUser: builder.mutation<User, UpdateUserPayload>({
      query: ({ id, ...patch }) => ({
        url: `users/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<{}, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetUserQuery, useUpdateUserMutation, useDeleteUserMutation } = userApi;
