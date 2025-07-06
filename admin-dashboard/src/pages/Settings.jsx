import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '@context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

export default function Settings() {
  const [admin, setAdmin] = useState({ name: '', email: '', username: '' });
  const [passwordData, setPasswordData] = useState({ current: '', newPass: '', confirm: '' });
  const [message, setMessage] = useState(null);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const res = await axios.get('/api/admin/profile');
        setAdmin(res.data);
      } catch (err) {
        console.error('Error fetching admin profile', err);
      }
    }
    fetchAdmin();
  }, []);

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPass !== passwordData.confirm) {
      setMessage('New passwords do not match.');
      return;
    }
    try {
      await axios.put('/api/admin/password', {
        currentPassword: passwordData.current,
        newPassword: passwordData.newPass,
      });
      setMessage('Password updated successfully.');
      setPasswordData({ current: '', newPass: '', confirm: '' });
    } catch (err) {
      console.error('Password update failed', err);
      setMessage('Failed to update password.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center md:text-left">Settings & Profile</h1>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Name:</span> {admin.name}</p>
          <p><span className="font-medium">Email:</span> {admin.email}</p>
          <p><span className="font-medium">Username:</span> {admin.username}</p>
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Log Out
        </button>
      </div>

      <form
        onSubmit={handlePasswordSubmit}
        className="bg-white p-6 rounded-xl shadow-md"
      >
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input
              type="password"
              name="current"
              value={passwordData.current}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              name="newPass"
              value={passwordData.newPass}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirm"
              value={passwordData.confirm}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Update Password
        </button>
        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
      </form>
    </div>
  );
}
