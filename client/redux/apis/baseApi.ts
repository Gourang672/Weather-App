import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URI || '';
  return url.endsWith('/') ? url : `${url}/`;
};

const baseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
  prepareHeaders: (headers) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  },
});

export const baseApi = createApi({
  baseQuery: baseQuery,
  tagTypes: ['User', 'Auth', 'City', 'Favorite', 'Weather'],
  endpoints: () => ({}),
});