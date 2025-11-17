import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/auth.service';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setUser } from '../../store/authSlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import type { SignInDto } from '../../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<SignInDto>({
    phone_number: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ phone_number?: string; password?: string }>({});

  const loginMutation = useMutation({
    mutationFn: authService.signIn,
    onSuccess: (data) => {
      dispatch(setUser(data));
      navigate('/');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login failed';
      setErrors({ password: Array.isArray(message) ? message.join(', ') : message });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const newErrors: { phone_number?: string; password?: string } = {};
    if (!formData.phone_number) {
      newErrors.phone_number = 'Phone number is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    loginMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to your admin account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Phone Number"
              type="text"
              name="phone_number"
              placeholder="998890123456"
              value={formData.phone_number}
              onChange={handleChange}
              error={errors.phone_number}
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
