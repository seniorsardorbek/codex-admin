import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { UsersListPage } from './pages/users/UsersListPage';
import { UserDetailPage } from './pages/users/UserDetailPage';
import { UserFormPage } from './pages/users/UserFormPage';
import { CoursesListPage } from './pages/courses/CoursesListPage';
import { CourseDetailPage } from './pages/courses/CourseDetailPage';
import { CourseFormPage } from './pages/courses/CourseFormPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/users" element={<UsersListPage />} />
                  <Route path="/users/new" element={<UserFormPage />} />
                  <Route path="/users/:id" element={<UserDetailPage />} />
                  <Route path="/users/:id/edit" element={<UserFormPage />} />
                  <Route path="/courses" element={<CoursesListPage />} />
                  <Route path="/courses/new" element={<CourseFormPage />} />
                  <Route path="/courses/:id" element={<CourseDetailPage />} />
                  <Route path="/courses/:id/edit" element={<CourseFormPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
