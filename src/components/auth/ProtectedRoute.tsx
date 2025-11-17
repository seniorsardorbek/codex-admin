import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../../services/auth.service';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { setUser, clearUser, setLoading } from '../../store/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  const { data, isError, isLoading: isVerifying } = useQuery({
    queryKey: ['verifyToken'],
    queryFn: authService.verifyToken,
    retry: false,
    enabled: !isAuthenticated,
  });

  useEffect(() => {
    if (data?.user) {
      dispatch(
        setUser({
          id: data.user.id,
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          phone_number: data.user.phone_number,
          role: 'ADMIN' as any, // Default role
        })
      );
    } else if (isError) {
      dispatch(clearUser());
    } else {
      dispatch(setLoading(isVerifying));
    }
  }, [data, isError, isVerifying, dispatch]);

  if (isLoading || isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && isError) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
