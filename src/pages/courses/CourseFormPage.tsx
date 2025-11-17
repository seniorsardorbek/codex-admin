import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { coursesService } from '../../services/courses.service';
import { usersService } from '../../services/users.service';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../components/ui/Card';
import type { CreateCourseDto, UpdateCourseDto } from '../../types';

type CourseFormData = CreateCourseDto;

export const CourseFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = id && id !== 'new';

  // Form setup with React Hook Form
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormData>({
    defaultValues: {
      title: '',
      description: '',
      duration: 0,
      status: 'DRAFT',
      teacher_id: '',
      image_url: '',
    },
  });

  // Fetch course data if editing
  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: ['course', id],
    queryFn: () => coursesService.getCourseById(id!),
    enabled: !!isEdit,
  });

  // Fetch teachers for dropdown
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getUsers,
  });

  const teachers = users?.filter((user) => user.role === 'TEACHER' || user.role === 'ADMIN') || [];

  // Reset form when course data is loaded
  useEffect(() => {
    if (course) {
      reset({
        title: course.title,
        description: course.description || '',
        duration: course.duration || 0,
        status: course.status,
        teacher_id: course.teacher_id || '',
        image_url: course.image_url || '',
      });
    }
  }, [course, reset]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: coursesService.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      navigate('/courses');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to create course');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseDto }) =>
      coursesService.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', id] });
      navigate(`/courses/${id}`);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to update course');
    },
  });

  // Form submit handler
  const onSubmit = (data: CourseFormData) => {
    if (isEdit) {
      // Clean up data for update
      const updateData: UpdateCourseDto = {
        title: data.title,
        description: data.description || undefined,
        duration: data.duration && data.duration > 0 ? Number(data.duration) : undefined,
        status: data.status,
        teacher_id: data.teacher_id || undefined,
        image_url: data.image_url || undefined,
      };
      updateMutation.mutate({ id: id!, data: updateData });
    } else {
      // Clean up data for create
      const createData: CreateCourseDto = {
        title: data.title,
        description: data.description || undefined,
        duration: data.duration && data.duration > 0 ? Number(data.duration) : undefined,
        status: data.status,
        teacher_id: data.teacher_id || undefined,
        image_url: data.image_url || undefined,
      };
      createMutation.mutate(createData);
    }
  };

  if (isLoadingCourse) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isEdit ? 'Edit Course' : 'Create Course'}
          </h1>
          <p className="text-slate-500 mt-1">
            {isEdit ? 'Update course information' : 'Add a new course to the system'}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
            <CardDescription>Fill in the course details below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <Input
              label="Title *"
              placeholder="e.g., Introduction to Web Development"
              {...register('title', {
                required: 'Title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters',
                },
              })}
              error={errors.title?.message}
            />

            {/* Description */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  label="Description"
                  placeholder="Provide a detailed description of the course..."
                  {...field}
                  error={errors.description?.message}
                />
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Duration */}
              <Input
                label="Duration (hours)"
                type="number"
                min="0"
                placeholder="e.g., 40"
                {...register('duration', {
                  min: {
                    value: 0,
                    message: 'Duration must be positive',
                  },
                })}
                error={errors.duration?.message}
              />

              {/* Status */}
              <Controller
                name="status"
                control={control}
                rules={{ required: 'Status is required' }}
                render={({ field }) => (
                  <Select
                    label="Status *"
                    {...field}
                    options={[
                      { value: 'DRAFT', label: 'Draft' },
                      { value: 'PUBLISHED', label: 'Published' },
                      { value: 'ARCHIVED', label: 'Archived' },
                    ]}
                    error={errors.status?.message}
                  />
                )}
              />
            </div>

            {/* Teacher */}
            <Controller
              name="teacher_id"
              control={control}
              render={({ field }) => (
                <Select
                  label="Teacher"
                  {...field}
                  options={[
                    { value: '', label: 'No teacher assigned' },
                    ...teachers.map((teacher) => ({
                      value: teacher.id,
                      label: `${teacher.first_name} ${teacher.last_name} (${teacher.role})`,
                    })),
                  ]}
                  error={errors.teacher_id?.message}
                />
              )}
            />

            {/* Image URL */}
            <Input
              label="Image URL"
              type="url"
              placeholder="https://example.com/course-image.jpg"
              {...register('image_url', {
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Please enter a valid URL',
                },
              })}
              error={errors.image_url?.message}
            />

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
              >
                {isSubmitting || createMutation.isPending || updateMutation.isPending
                  ? 'Saving...'
                  : isEdit
                  ? 'Update Course'
                  : 'Create Course'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
