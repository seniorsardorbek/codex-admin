import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your application settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Settings page is under construction</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            This page will contain application settings and preferences.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
