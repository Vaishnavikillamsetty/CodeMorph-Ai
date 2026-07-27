import { apiRequest } from './api';
import { User } from '../types';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export const authService = {
  /** Register a new account using single name field */
  async signup(
    fullName: string,
    email: string,
    password: string,
  ): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ full_name: fullName, email, password }),
    });
  },

  /** Login with Name OR Email + Password */
  async login(
    identifier: string,
    password: string,
    rememberMe = false,
  ): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password, remember_me: rememberMe }),
    });
  },

  async getProfile(): Promise<User> {
    return apiRequest<User>('/users/me');
  },

  async updateProfile(
    fullName?: string,
    avatarUrl?: string,
    password?: string,
  ): Promise<User> {
    return apiRequest<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify({ full_name: fullName, avatar_url: avatarUrl, password }),
    });
  },
};
