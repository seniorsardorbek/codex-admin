import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { modulesService } from '../../services/modules.service';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { ModuleForm } from './ModuleForm';
import { LessonsList } from '../lessons/LessonsList';
import type { Module } from '../../types';

interface ModulesListProps {
  courseId: string;
}

export const ModulesList: React.FC<ModulesListProps> = ({ courseId }) => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  const {
    data: modules,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => modulesService.getModules({ course_id: courseId }),
  });

  const deleteMutation = useMutation({
    mutationFn: modulesService.deleteModule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules', courseId] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to delete module');
    },
  });

  const handleDelete = (module: Module) => {
    if (window.confirm(`Are you sure you want to delete "${module.title}"?`)) {
      deleteMutation.mutate(module.id);
    }
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingModule(null);
  };

  const handleSuccess = () => {
    handleCloseForm();
    queryClient.invalidateQueries({ queryKey: ['modules', courseId] });
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
          <p className="text-red-600 text-center">Error loading modules</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Course Modules</CardTitle>
            <CardDescription>Lessons and content for this course</CardDescription>
          </div>
          <Button onClick={() => setShowForm(true)}>Add Module</Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-6 p-4 border rounded-lg bg-slate-50">
            <ModuleForm
              courseId={courseId}
              module={editingModule}
              onSuccess={handleSuccess}
              onCancel={handleCloseForm}
            />
          </div>
        )}

        {modules && modules.length > 0 ? (
          <div className="space-y-4">
            {modules.map((module) => (
              <div
                key={module.id}
                className="border border-slate-200 rounded-lg overflow-hidden"
              >
                {/* Module Header */}
                <div className="bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-200 rounded text-sm font-semibold text-slate-700">
                          {module.order}
                        </span>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {module.title}
                        </h3>
                      </div>
                      {module.description && (
                        <p className="text-sm text-slate-600 ml-11">
                          {module.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 ml-11 text-sm text-slate-500">
                        {module.duration_minutes && (
                          <span className="flex items-center gap-1">
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
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {module.duration_minutes} min
                          </span>
                        )}
                        {module.video_url && (
                          <a
                            href={module.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
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
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Video
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setExpandedModuleId(
                            expandedModuleId === module.id ? null : module.id
                          );
                        }}
                      >
                        {expandedModuleId === module.id
                          ? 'Hide Lessons'
                          : 'Show Lessons'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(module)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(module)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Lessons Section - Expandable */}
                {expandedModuleId === module.id && (
                  <div className="p-4 bg-white border-t border-slate-200">
                    <LessonsList courseId={courseId} moduleId={module.id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500 mb-4">No modules added yet</p>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                Add your first module
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
