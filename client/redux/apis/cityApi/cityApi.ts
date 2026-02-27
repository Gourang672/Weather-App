import { baseApi } from '../baseApi';

interface City {
  _id: string;
  name: string;
  createdAt?: string;
}

interface CreateCityPayload {
  name: string;
}

interface UpdateCityPayload {
  id: string;
  name: string;
}

export const cityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // City endpoints
    createCity: builder.mutation<City, CreateCityPayload>({
      query: (city) => ({
        url: 'city',
        method: 'POST',
        body: city,
      }),
      invalidatesTags: ['City'],
    }),
    getCities: builder.query<City[], void>({
      query: () => 'city',
      providesTags: ['City'],
    }),
    getCity: builder.query<City, string>({
      query: (id) => `city/${id}`,
      providesTags: ['City'],
    }),
    updateCity: builder.mutation<City, UpdateCityPayload>({
      query: ({ id, ...patch }) => ({
        url: `city/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['City'],
    }),
    deleteCity: builder.mutation<void, string>({
      query: (id) => ({
        url: `city/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['City'],
    }),
  }),
  overrideExisting: false,
});

export const {
  // City hooks
  useCreateCityMutation,
  useGetCitiesQuery,
  useGetCityQuery,
  useUpdateCityMutation,
  useDeleteCityMutation,
} = cityApi;