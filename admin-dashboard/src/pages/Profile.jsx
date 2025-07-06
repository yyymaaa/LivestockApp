import { useState, useEffect } from 'react';
import {
  FiEdit2,
  FiSave,
  FiMail,
  FiPhone,
  FiUser,
  FiLock,
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi';
import api from '../api/api';
import AdminLayout from '@components/AdminLayout';

export default function Profile() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    contact_info: '',
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Password update state
  const [passwordData, setPasswordData] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });
  const [passMessage, setPassMessage] = useState(null);
  const [passError, setPassError] = useState(null);
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get('/admin/profile');
        setFormData(res.data);
      } catch (err) {
        console.error('Error fetching profile', err);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      await api.put('/admin/profile', formData);
      setSuccess(true);
      setEditing(false);
    } catch (err) {
      console.error('Update failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassMessage(null);
    setPassError(null);

    if (passwordData.newPass !== passwordData.confirm) {
      setPassError('❌ New passwords do not match.');
      return;
    }

    try {
      setPassLoading(true);
      await api.put('/admin/password', {
        currentPassword: passwordData.current,
        newPassword: passwordData.newPass,
      });
      setPassMessage('✅ Password updated successfully.');
      setPasswordData({ current: '', newPass: '', confirm: '' });
    } catch (err) {
      console.error('Password update failed', err);
      setPassError('❌ Failed to update password. Please check your current password.');
    } finally {
      setPassLoading(false);
    }
  };

  return (
      <div style={styles.container}>
        <h1 style={styles.heading}>My Profile</h1>

        {/* Profile Info Card */}
        <div style={styles.card}>
          <ProfileField
            icon={<FiUser />}
            label="Username"
            name="username"
            value={formData.username}
            editing={editing}
            onChange={handleChange}
          />
          <ProfileField
            icon={<FiMail />}
            label="Email"
            name="email"
            value={formData.email}
            editing={editing}
            onChange={handleChange}
          />
          <ProfileField
            icon={<FiPhone />}
            label="Contact Info"
            name="contact_info"
            value={formData.contact_info}
            editing={editing}
            onChange={handleChange}
          />

          <div style={styles.actions}>
            {editing ? (
              <button
                onClick={handleSubmit}
                style={styles.saveBtn}
                disabled={loading}
              >
                <FiSave style={{ marginRight: '0.5rem' }} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            ) : (
              <button onClick={() => setEditing(true)} style={styles.editBtn}>
                <FiEdit2 style={{ marginRight: '0.5rem' }} />
                Edit Profile
              </button>
            )}
            {success && (
              <p style={styles.successText}>✅ Profile updated successfully</p>
            )}
          </div>
        </div>

        {/* Change Password Section */}
        <form style={styles.card} onSubmit={handlePasswordSubmit}>
          <h2 style={styles.subHeading}>
            <FiLock style={{ marginRight: '0.5rem' }} />
            Change Password
          </h2>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Current Password</label>
            <input
              type="password"
              name="current"
              value={passwordData.current}
              onChange={handlePasswordChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>New Password</label>
            <input
              type="password"
              name="newPass"
              value={passwordData.newPass}
              onChange={handlePasswordChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Confirm New Password</label>
            <input
              type="password"
              name="confirm"
              value={passwordData.confirm}
              onChange={handlePasswordChange}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.editBtn} disabled={passLoading}>
            {passLoading ? 'Updating...' : 'Update Password'}
          </button>

          {passMessage && <p style={styles.successText}>{passMessage}</p>}
          {passError && <p style={styles.errorText}>{passError}</p>}
        </form>
      </div>
  );
}

function ProfileField({ icon, label, name, value, editing, onChange }) {
  return (
    <div style={styles.fieldGroup}>
      <label style={styles.label}>
        <span style={styles.labelIcon}>{icon}</span>
        {label}
      </label>
      {editing ? (
        <input
          type="text"
          name={name}
          value={value || ''}
          onChange={onChange}
          style={styles.input}
        />
      ) : (
        <p style={styles.readonlyText}>{value || '—'}</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '640px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '1.75rem',
    fontWeight: 600,
    color: '#14532d',
    marginBottom: '2rem',
  },
  subHeading: {
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    marginBottom: '2rem',
  },
  fieldGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    fontWeight: 500,
    fontSize: '0.95rem',
    color: '#374151',
    marginBottom: '0.4rem',
  },
  labelIcon: {
    fontSize: '1rem',
    color: '#10b981',
    marginRight: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.6rem 1rem',
    fontSize: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    outline: 'none',
  },
  readonlyText: {
    fontSize: '1rem',
    padding: '0.5rem 0',
    color: '#1f2937',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '1rem',
  },
  editBtn: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    padding: '0.65rem 1.25rem',
    borderRadius: '0.5rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    border: 'none',
    cursor: 'pointer',
  },
  saveBtn: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    padding: '0.65rem 1.25rem',
    borderRadius: '0.5rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    border: 'none',
    cursor: 'pointer',
  },
  successText: {
    fontSize: '0.9rem',
    color: '#16a34a',
    fontWeight: 500,
    marginTop: '1rem',
  },
  errorText: {
    fontSize: '0.9rem',
    color: '#dc2626',
    fontWeight: 500,
    marginTop: '1rem',
  },
};
