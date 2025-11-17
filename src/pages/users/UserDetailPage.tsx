import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { usersService } from '../../services/users.service';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';

export const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', id],
    queryFn: () => usersService.getUserById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600">Error loading user</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Details</h1>
          <p className="text-slate-500 mt-1">View user information</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Link to={`/users/${id}/edit`}>
            <Button>Edit User</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>User's personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-500">First Name</label>
              <p className="text-base text-slate-900">{user.first_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Last Name</label>
              <p className="text-base text-slate-900">{user.last_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Phone Number</label>
              <p className="text-base text-slate-900">{user.phone_number}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Account settings and metadata</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-500">Role</label>
              <p className="text-base text-slate-900">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'TEACHER' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Language</label>
              <p className="text-base text-slate-900">{user.lang}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Created At</label>
              <p className="text-base text-slate-900">
                {new Date(user.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Updated At</label>
              <p className="text-base text-slate-900">
                {new Date(user.updated_at).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
