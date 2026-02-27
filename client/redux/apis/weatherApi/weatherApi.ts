import { baseApi } from '../baseApi';

export const weatherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWeather: builder.query({
      query: (location) => {
        return {
          url: 'weather',
          params: { location },
        };
      },
      providesTags: ['Weather'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetWeatherQuery } = weatherApi;
