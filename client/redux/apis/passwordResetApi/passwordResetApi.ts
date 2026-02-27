import { baseApi } from '../baseApi';

export const passwordResetApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    requestPasswordReset: builder.mutation({
      query: (email: { email: string }) => ({
        url: 'auth/request-password-reset',
        method: 'POST',
        body: email,
      }),
    }),
    verifyPasswordResetOtp: builder.mutation({
      query: (data: { email: string; code: string }) => ({
        url: 'auth/verify-password-reset-otp',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data: { email: string; newPassword: string }) => ({
        url: 'auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { 
  useRequestPasswordResetMutation, 
  useVerifyPasswordResetOtpMutation, 
  useResetPasswordMutation 
} = passwordResetApi;
