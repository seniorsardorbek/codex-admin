import React from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { authService } from '../../services/auth.service';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-slate-900">Welcome back!</h2>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-slate-500">{user.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                <span className="text-sm font-medium text-slate-700">
                  {user.first_name.charAt(0)}
                  {user.last_name.charAt(0)}
                </span>
              </div>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
