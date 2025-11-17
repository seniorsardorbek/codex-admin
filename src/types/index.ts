// User roles
export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

// Language options
export type Language = 'UZ' | 'EN' | 'RU';

// User entity
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  lang: Language;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// Auth DTOs
export interface SignUpDto {
  first_name: string;
  last_name: string;
  phone_number: string;
  password: string;
}

export interface SignInDto {
  phone_number: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone_number: string;
}

export interface VerifyTokenResponse {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
  };
}

// User DTOs
export interface CreateUserDto {
  first_name: string;
  last_name: string;
  phone_number: string;
  password: string;
}

export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  lang?: Language;
  role?: UserRole;
}

// API Error Response
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

// Auth state
export interface AuthState {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Course Status
export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

// Course Entity
export interface Course {
  id: string;
  title: string;
  description: string | null;
  duration: number | null;
  status: CourseStatus;
  teacher_id: string | null;
  teacher?: User;
  image_url: string | null;
  enrolled_count: number;
  created_at: string;
  updated_at: string;
}

// Course DTOs
export interface CreateCourseDto {
  title: string;
  description?: string;
  duration?: number;
  status?: CourseStatus;
  teacher_id?: string;
  image_url?: string;
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  duration?: number;
  status?: CourseStatus;
  teacher_id?: string;
  image_url?: string;
}

// Module Entity
export interface Module {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  order: number;
  course_id: string;
  course?: Course;
  duration_minutes: number | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
}

// Module DTOs
export interface CreateModuleDto {
  title: string;
  description?: string;
  content?: string;
  order: number;
  course_id: string;
  duration_minutes?: number;
  video_url?: string;
}

export interface UpdateModuleDto {
  title?: string;
  description?: string;
  content?: string;
  order?: number;
  course_id?: string;
  duration_minutes?: number;
  video_url?: string;
}

// Lesson Entity
export interface Lesson {
  id: string;
  order: number;
  title: string;
  description: string | null;
  course_id: string;
  module_id: string | null;
  course?: Course;
  module?: Module;
  created_at: string;
  updated_at: string;
}

// Lesson DTOs
export interface CreateLessonDto {
  order: number;
  title: string;
  description?: string;
  course_id: string;
  module_id?: string;
}

export interface UpdateLessonDto {
  order?: number;
  title?: string;
  description?: string;
  course_id?: string;
  module_id?: string;
}
