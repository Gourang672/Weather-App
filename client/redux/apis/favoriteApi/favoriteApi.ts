import { baseApi } from '../baseApi';

interface City {
  _id: string;
  name: string;
  user: string;
  createdAt?: string;
}

interface Favorite {
  _id: string;
  user: string;
  city: City;
  createdAt?: string;
}

interface CreateFavoritePayload {
  cityId: string;
}

interface UpdateFavoritePayload {
  id: string;
  cityId?: string;
}

export const favoriteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Favorite endpoints
    createFavorite: builder.mutation<Favorite, CreateFavoritePayload>({
      query: (favorite) => ({
        url: 'favorites',
        method: 'POST',
        body: favorite,
      }),
      invalidatesTags: ['Favorite'],
    }),
    getFavorites: builder.query<Favorite[], void>({
      query: () => 'favorites',
      providesTags: ['Favorite'],
    }),
    getFavorite: builder.query<Favorite, string>({
      query: (id) => `favorites/${id}`,
      providesTags: ['Favorite'],
    }),
    updateFavorite: builder.mutation<Favorite, UpdateFavoritePayload>({
      query: ({ id, ...patch }) => ({
        url: `favorites/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Favorite'],
    }),
    deleteFavorite: builder.mutation<void, string>({
      query: (id) => ({
        url: `favorites/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Favorite'],
    }),
    getUserFavorites: builder.query<Favorite[], void>({
      query: () => 'favorites',
      providesTags: ['Favorite'],
    }),
  }),
  overrideExisting: false,
});

export const {
  // Favorite hooks
  useCreateFavoriteMutation,
  useGetFavoritesQuery,
  useGetFavoriteQuery,
  useUpdateFavoriteMutation,
  useDeleteFavoriteMutation,
  useGetUserFavoritesQuery,
} = favoriteApi;