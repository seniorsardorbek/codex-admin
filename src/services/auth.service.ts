import axiosInstance from '../utils/axios';
import type { SignInDto, SignUpDto, AuthResponse, VerifyTokenResponse } from '../types';

export const authService = {
  // Sign up
  signUp: async (data: SignUpDto): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/sign-up', data);
    return response.data;
  },

  // Sign in
  signIn: async (data: SignInDto): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/sign-in', data);
    return response.data;
  },

  // Verify token
  verifyToken: async (): Promise<VerifyTokenResponse> => {
    const response = await axiosInstance.get<VerifyTokenResponse>('/auth/');
    return response.data;
  },

  // Logout (client-side only, clear cookie by calling a non-existent endpoint or just redirect)
  logout: () => {
    // The cookie is HttpOnly, so we can't delete it from client
    // Just redirect to login and let the server handle it
    window.location.href = '/login';
  },
};
