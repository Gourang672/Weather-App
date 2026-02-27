import { baseApi } from '../baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials: { name: string; email: string; password: string; location?: string; tempUnit?: string; windUnit?: string }) => ({
        url: 'users',
        method: 'POST',
        body: credentials,
      }),
    }),
    login: builder.mutation({
      query: (credentials: { email: string; password: string }) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    requestOtp: builder.mutation({
      query: (email: { email: string }) => ({
        url: 'auth/request-otp',
        method: 'POST',
        body: email,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data: { email: string; code: string }) => ({
        url: 'auth/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useRegisterMutation, useLoginMutation, useRequestOtpMutation, useVerifyOtpMutation, useLogoutMutation } = authApi;