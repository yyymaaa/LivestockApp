import { useEffect, useState } from 'react';
import api from '../api/api';
import axios from 'axios';

export default function Users() {
  const [data, setData] = useState({
  users: [],
  totalUsers: 0,
  currentPage: 1,
  totalPages: 1,
  });

  const [role, setRole] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const endpoint =
         role === 'all'
          ? '/api/admin/manage-users'
          : `/api/admin/manage-users?role=${role}`; // Add role param if filtering

        const res = await axios.get(endpoint);
        setData(res.data);
      } catch (err) {
        console.error('Error fetching users', err);
        setError('Failed to load users.');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [role]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>User Management</h1>

      <div style={styles.filterRow}>
        <label style={styles.label}>Filter by Role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={styles.select}
        >
          <option value="all">All</option>
          <option value="admin">Admin</option>
          <option value="Farmer">Farmer</option>
          <option value="Livestock Service Provider">Service Provider</option>
          <option value="Livestock Product Buyer">Buyer</option>
        </select>
      </div>

      {loading ? (
        <p style={styles.statusText}>Loading users...</p>
      ) : error ? (
        <p style={{ ...styles.statusText, color: '#dc2626' }}>{error}</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {data?.users?.length > 0 ? (
              data.users.map((user) => (
                <tr key={user.user_id}>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.username}</td>
                  <td style={{ ...styles.td, textTransform: 'capitalize' }}>{user.role}</td>
                  <td style={styles.td}>{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))
              ) : (
              <tr>
                <td colSpan="4" style={styles.td}>No users found.</td>
              </tr>
             )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 600,
    color: '#14532d',
    marginBottom: '1.5rem',
  },
  filterRow: {
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  label: {
    fontWeight: 500,
    fontSize: '1rem',
    color: '#374151',
  },
  select: {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    outline: 'none',
  },
  tableWrapper: {
    overflowX: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeaderRow: {
    backgroundColor: '#f3f4f6',
    textAlign: 'left',
  },
  th: {
    padding: '0.75rem 1rem',
    fontWeight: 600,
    fontSize: '0.95rem',
    color: '#374151',
    borderBottom: '1px solid #e5e7eb',
  },
  tableRow: {
    borderBottom: '1px solid #e5e7eb',
    transition: 'background 0.2s',
    cursor: 'default',
  },
  td: {
    padding: '0.75rem 1rem',
    fontSize: '0.95rem',
    color: '#1f2937',
  },
  statusText: {
    fontSize: '0.95rem',
    marginTop: '1rem',
    color: '#4b5563',
  },
};
