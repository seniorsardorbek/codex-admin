import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesService } from '../../services/courses.service';
import { Button } from '../../components/ui/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../components/ui/Card';
import { ModulesList } from '../../components/modules/ModulesList';
import type { CourseStatus } from '../../types';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: () => coursesService.getCourseById(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: coursesService.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      navigate('/courses');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to delete course');
    },
  });

  const handleDelete = () => {
    if (course && window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
      deleteMutation.mutate(course.id);
    }
  };

  const getStatusBadgeColor = (status: CourseStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading course</p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Course Details</h1>
          <p className="text-slate-500 mt-1">View course information</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Link to={`/courses/${id}/edit`}>
            <Button>Edit Course</Button>
          </Link>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Course details and description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-500">Title</label>
              <p className="text-base text-slate-900">{course.title}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">
                Description
              </label>
              <p className="text-base text-slate-900">
                {course.description || 'No description provided'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Status</label>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                    course.status
                  )}`}
                >
                  {course.status}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">
                Duration
              </label>
              <p className="text-base text-slate-900">
                {course.duration ? `${course.duration} hours` : 'Not specified'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Teacher & Enrollment Info */}
        <Card>
          <CardHeader>
            <CardTitle>Teacher & Enrollment</CardTitle>
            <CardDescription>Teacher and enrollment information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-500">Teacher</label>
              <p className="text-base text-slate-900">
                {course.teacher
                  ? `${course.teacher.first_name} ${course.teacher.last_name}`
                  : 'No teacher assigned'}
              </p>
              {course.teacher && (
                <p className="text-sm text-slate-500">
                  {course.teacher.phone_number}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">
                Enrolled Students
              </label>
              <p className="text-base text-slate-900">{course.enrolled_count}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">
                Created At
              </label>
              <p className="text-base text-slate-900">
                {new Date(course.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">
                Last Updated
              </label>
              <p className="text-base text-slate-900">
                {new Date(course.updated_at).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Image */}
      {course.image_url && (
        <Card>
          <CardHeader>
            <CardTitle>Course Image</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={course.image_url}
              alt={course.title}
              className="max-w-full h-auto rounded-lg"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Course Modules & Lessons */}
      <ModulesList courseId={course.id} />
    </div>
  );
};
