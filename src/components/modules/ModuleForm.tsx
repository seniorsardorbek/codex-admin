import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { modulesService } from '../../services/modules.service';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import type { CreateModuleDto, UpdateModuleDto, Module } from '../../types';

interface ModuleFormProps {
  courseId: string;
  module?: Module | null;
  onSuccess: () => void;
  onCancel: () => void;
}

type ModuleFormData = Omit<CreateModuleDto, 'course_id'>;

export const ModuleForm: React.FC<ModuleFormProps> = ({
  courseId,
  module,
  onSuccess,
  onCancel,
}) => {
  const isEdit = !!module;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ModuleFormData>({
    defaultValues: {
      title: '',
      description: '',
      content: '',
      order: 1,
      duration_minutes: 0,
      video_url: '',
    },
  });

  useEffect(() => {
    if (module) {
      reset({
        title: module.title,
        description: module.description || '',
        content: module.content || '',
        order: module.order,
        duration_minutes: module.duration_minutes || 0,
        video_url: module.video_url || '',
      });
    }
  }, [module, reset]);

  const createMutation = useMutation({
    mutationFn: modulesService.createModule,
    onSuccess,
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to create module');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateModuleDto }) =>
      modulesService.updateModule(id, data),
    onSuccess,
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to update module');
    },
  });

  const onSubmit = (data: ModuleFormData) => {
    const cleanedData: CreateModuleDto | UpdateModuleDto = {
      title: data.title,
      description: data.description || undefined,
      content: data.content || undefined,
      order: Number(data.order),
      course_id: courseId,
      duration_minutes:
        data.duration_minutes && data.duration_minutes > 0
          ? Number(data.duration_minutes)
          : undefined,
      video_url: data.video_url || undefined,
    };

    if (isEdit) {
      updateMutation.mutate({ id: module.id, data: cleanedData });
    } else {
      createMutation.mutate(cleanedData as CreateModuleDto);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        {isEdit ? 'Edit Module' : 'Add New Module'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Title *"
          placeholder="e.g., Introduction to Variables"
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
          label="Order *"
          type="number"
          min="1"
          placeholder="e.g., 1"
          {...register('order', {
            required: 'Order is required',
            min: {
              value: 1,
              message: 'Order must be at least 1',
            },
          })}
          error={errors.order?.message}
        />
      </div>

      <Input
        label="Description"
        placeholder="Brief description of the module"
        {...register('description')}
        error={errors.description?.message}
      />

      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <Textarea
            label="Content"
            placeholder="Detailed module content..."
            {...field}
            error={errors.content?.message}
          />
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Duration (minutes)"
          type="number"
          min="0"
          placeholder="e.g., 45"
          {...register('duration_minutes', {
            min: {
              value: 0,
              message: 'Duration must be positive',
            },
          })}
          error={errors.duration_minutes?.message}
        />

        <Input
          label="Video URL"
          type="url"
          placeholder="https://example.com/video.mp4"
          {...register('video_url', {
            pattern: {
              value: /^https?:\/\/.+/,
              message: 'Please enter a valid URL',
            },
          })}
          error={errors.video_url?.message}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
        >
          {isSubmitting || createMutation.isPending || updateMutation.isPending
            ? 'Saving...'
            : isEdit
            ? 'Update Module'
            : 'Add Module'}
        </Button>
      </div>
    </form>
  );
};
