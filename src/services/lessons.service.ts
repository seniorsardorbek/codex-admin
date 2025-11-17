import axiosInstance from '../utils/axios';
import type { Lesson, CreateLessonDto, UpdateLessonDto } from '../types';

export const lessonsService = {
  // Get all lessons with optional course or module filter
  getLessons: async (params?: { course_id?: string; module_id?: string }): Promise<Lesson[]> => {
    const response = await axiosInstance.get<Lesson[]>('/lessons', { params });
    return response.data;
  },

  // Get lesson by ID
  getLessonById: async (id: string): Promise<Lesson> => {
    const response = await axiosInstance.get<Lesson>(`/lessons/${id}`);
    return response.data;
  },

  // Create lesson
  createLesson: async (data: CreateLessonDto): Promise<Lesson> => {
    const response = await axiosInstance.post<Lesson>('/lessons', data);
    return response.data;
  },

  // Update lesson
  updateLesson: async (id: string, data: UpdateLessonDto): Promise<Lesson> => {
    const response = await axiosInstance.patch<Lesson>(`/lessons/${id}`, data);
    return response.data;
  },

  // Delete lesson
  deleteLesson: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/lessons/${id}`);
  },
};
