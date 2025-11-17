import axiosInstance from '../utils/axios';
import type { User, CreateUserDto, UpdateUserDto } from '../types';

export const usersService = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get<User[]>('/users');
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  },

  // Create user
  createUser: async (data: CreateUserDto): Promise<User> => {
    const response = await axiosInstance.post<User>('/users', data);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await axiosInstance.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<{ affected: number }> => {
    const response = await axiosInstance.delete<{ affected: number }>(`/users/${id}`);
    return response.data;
  },
};
