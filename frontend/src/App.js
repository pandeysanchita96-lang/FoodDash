import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import UserDashboard from './components/user/UserDashboard';
import VendorDashboard from './components/vendor/VendorDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import LandingPage from './components/home/LandingPage';
import authService from './services/authService';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = authService.getCurrentUser();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route
                path="/user/*"
                element={
                  <ProtectedRoute allowedRoles={['USER']}>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/vendor/*"
                element={
                  <ProtectedRoute allowedRoles={['VENDOR']}>
                    <VendorDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
