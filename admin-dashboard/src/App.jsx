import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '@pages/Login';
import NotFound from '@pages/NotFound';
import Dashboard from '@pages/Dashboard';
import Users from '@pages/Users';
import Listings from '@pages/Listings';
import Reports from '@pages/Reports';
import Notifications from '@pages/Notifications';
import Settings from '@pages/Settings';
import Profile from '@pages/Profile';
import ProtectedRoute from '@components/ProtectedRoute';
import AdminLayout from '@components/AdminLayout';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="listings" element={<Listings />} />
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
