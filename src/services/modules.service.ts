import axiosInstance from '../utils/axios';
import type { Module, CreateModuleDto, UpdateModuleDto } from '../types';

export const modulesService = {
  // Get all modules with optional course filter
  getModules: async (params?: { course_id?: string }): Promise<Module[]> => {
    const response = await axiosInstance.get<Module[]>('/modules', { params });
    return response.data;
  },

  // Get module by ID
  getModuleById: async (id: string): Promise<Module> => {
    const response = await axiosInstance.get<Module>(`/modules/${id}`);
    return response.data;
  },

  // Create module
  createModule: async (data: CreateModuleDto): Promise<Module> => {
    const response = await axiosInstance.post<Module>('/modules', data);
    return response.data;
  },

  // Update module
  updateModule: async (id: string, data: UpdateModuleDto): Promise<Module> => {
    const response = await axiosInstance.patch<Module>(`/modules/${id}`, data);
    return response.data;
  },

  // Delete module
  deleteModule: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/modules/${id}`);
  },
};
