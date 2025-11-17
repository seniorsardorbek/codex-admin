import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { usersService } from '../services/users.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

export const DashboardPage: React.FC = () => {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getUsers,
  });

  const totalUsers = users?.length || 0;
  const students = users?.filter(u => u.role === 'STUDENT').length || 0;
  const teachers = users?.filter(u => u.role === 'TEACHER').length || 0;
  const admins = users?.filter(u => u.role === 'ADMIN').length || 0;

  const stats = [
    { title: 'Total Users', value: totalUsers, icon: '👥', color: 'bg-blue-500' },
    { title: 'Students', value: students, icon: '🎓', color: 'bg-green-500' },
    { title: 'Teachers', value: teachers, icon: '👨‍🏫', color: 'bg-purple-500' },
    { title: 'Admins', value: admins, icon: '👑', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of your system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest users added to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users?.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-slate-700">
                      {user.first_name.charAt(0)}
                      {user.last_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-slate-500">{user.phone_number}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'TEACHER' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
