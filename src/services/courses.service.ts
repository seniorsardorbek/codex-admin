import axiosInstance from '../utils/axios';
import type { Course, CreateCourseDto, UpdateCourseDto } from '../types';

export const coursesService = {
  // Get all courses with optional filters
  getCourses: async (params?: {
    status?: string;
    teacher_id?: string;
  }): Promise<Course[]> => {
    const response = await axiosInstance.get<Course[]>('/courses', { params });
    return response.data;
  },

  // Get course by ID
  getCourseById: async (id: string): Promise<Course> => {
    const response = await axiosInstance.get<Course>(`/courses/${id}`);
    return response.data;
  },

  // Create course
  createCourse: async (data: CreateCourseDto): Promise<Course> => {
    const response = await axiosInstance.post<Course>('/courses', data);
    return response.data;
  },

  // Update course
  updateCourse: async (id: string, data: UpdateCourseDto): Promise<Course> => {
    const response = await axiosInstance.patch<Course>(`/courses/${id}`, data);
    return response.data;
  },

  // Delete course
  deleteCourse: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/courses/${id}`);
  },
};
