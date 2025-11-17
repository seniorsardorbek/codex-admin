import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { lessonsService } from '../../services/lessons.service';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { LessonItem } from './LessonItem';
import type { Lesson, CreateLessonDto, UpdateLessonDto } from '../../types';

interface LessonsListProps {
  courseId: string;
  moduleId?: string;
}

export const LessonsList: React.FC<LessonsListProps> = ({ courseId, moduleId }) => {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);

  // Use moduleId if provided, otherwise use courseId for filtering
  const filterKey = moduleId ? 'module' : 'course';
  const filterId = moduleId || courseId;

  const {
    data: lessons,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['lessons', filterKey, filterId],
    queryFn: () =>
      lessonsService.getLessons(
        moduleId ? { module_id: moduleId } : { course_id: courseId }
      ),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<CreateLessonDto, 'course_id' | 'module_id' | 'order'>>({
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: lessonsService.createLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons', filterKey, filterId] });
      reset();
      setShowAddForm(false);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to create lesson');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLessonDto }) =>
      lessonsService.updateLesson(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons', filterKey, filterId] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to update lesson');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: lessonsService.deleteLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons', filterKey, filterId] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to delete lesson');
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !lessons) return;

    if (active.id !== over.id) {
      const oldIndex = lessons.findIndex((lesson) => lesson.id === active.id);
      const newIndex = lessons.findIndex((lesson) => lesson.id === over.id);

      const reorderedLessons = arrayMove(lessons, oldIndex, newIndex);

      // Optimistically update the UI
      queryClient.setQueryData(['lessons', filterKey, filterId], reorderedLessons);

      // Update all affected lessons' order
      const updates = reorderedLessons.map((lesson, index) => {
        const newOrder = index + 1;
        if (lesson.order !== newOrder) {
          return updateMutation.mutateAsync({
            id: lesson.id,
            data: { order: newOrder },
          });
        }
        return Promise.resolve();
      });

      Promise.all(updates).catch(() => {
        // Revert on error
        queryClient.invalidateQueries({ queryKey: ['lessons', filterKey, filterId] });
      });
    }
  };

  const onSubmit = (data: Omit<CreateLessonDto, 'course_id' | 'module_id' | 'order'>) => {
    const nextOrder = lessons ? lessons.length + 1 : 1;
    createMutation.mutate({
      title: data.title,
      description: data.description || undefined,
      course_id: courseId,
      module_id: moduleId,
      order: nextOrder,
    });
  };

  const handleUpdate = (id: string, data: UpdateLessonDto) => {
    updateMutation.mutate({ id, data });
  };

  const handleDelete = (lesson: Lesson) => {
    if (window.confirm(`Are you sure you want to delete "${lesson.title}"?`)) {
      deleteMutation.mutate(lesson.id);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-red-600 text-center">Error loading lessons</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Lessons</CardTitle>
            <CardDescription>
              Drag to reorder • {lessons?.length || 0} lesson{lessons?.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : 'Add Lesson'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <div className="mb-6 p-4 border border-slate-200 rounded-lg bg-slate-50">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <h4 className="font-medium text-slate-900 mb-3">Add New Lesson</h4>
              <Input
                placeholder="Lesson title"
                {...register('title', {
                  required: 'Title is required',
                  minLength: {
                    value: 3,
                    message: 'Title must be at least 3 characters',
                  },
                })}
                error={errors.title?.message}
              />
              <Input
                placeholder="Lesson description (optional)"
                {...register('description')}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddForm(false);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Adding...' : 'Add Lesson'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {lessons && lessons.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={lessons.map((l) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-0">
                {lessons.map((lesson) => (
                  <LessonItem
                    key={lesson.id}
                    lesson={lesson}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    isUpdating={updateMutation.isPending}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
            <svg
              className="mx-auto h-12 w-12 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-slate-900">No lessons</h3>
            <p className="mt-1 text-sm text-slate-500">
              Get started by creating your first lesson
            </p>
            {!showAddForm && (
              <div className="mt-6">
                <Button onClick={() => setShowAddForm(true)}>Add Lesson</Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
