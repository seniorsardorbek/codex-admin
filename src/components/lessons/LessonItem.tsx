import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Lesson, UpdateLessonDto } from '../../types';

interface LessonItemProps {
  lesson: Lesson;
  onUpdate: (id: string, data: UpdateLessonDto) => void;
  onDelete: (lesson: Lesson) => void;
  isUpdating: boolean;
}

export const LessonItem: React.FC<LessonItemProps> = ({
  lesson,
  onUpdate,
  onDelete,
  isUpdating,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateLessonDto>({
    defaultValues: {
      title: lesson.title,
      description: lesson.description || '',
    },
  });

  const onSubmit = (data: UpdateLessonDto) => {
    onUpdate(lesson.id, {
      title: data.title,
      description: data.description || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white border border-slate-200 rounded-lg p-4 mb-2"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-100 rounded text-sm font-medium text-slate-600">
              #{lesson.order}
            </div>
            <div className="flex-1 space-y-3">
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
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-slate-200 rounded-lg p-4 mb-2 hover:border-slate-300 transition-colors group"
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-100 rounded text-sm font-medium text-slate-600 cursor-grab active:cursor-grabbing hover:bg-slate-200 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">
                  #{lesson.order}
                </span>
                <h4 className="font-medium text-slate-900 truncate">
                  {lesson.title}
                </h4>
              </div>
              {lesson.description && (
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                  {lesson.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(lesson)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
