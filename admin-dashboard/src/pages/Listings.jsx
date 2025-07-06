import { useEffect, useState } from 'react';
import { FiPackage, FiTool, FiSearch } from 'react-icons/fi';
import api from '../api/api';
import AdminLayout from '@components/AdminLayout';

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [type, setType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      setError('');
      try {
        const endpoint = type === 'all' ? '/listings' : `/api/listings/${type}`;
        const res = await api.get(endpoint);
        setListings(res.data.listings);
      } catch (err) {
        console.error('Failed to fetch listings', err);
        setError('Failed to load listings.');
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [type]);

  return (
      <div style={styles.container}>
        <h1 style={styles.heading}>Listings Management</h1>

        <div style={styles.filterRow}>
          <label style={styles.label}>Filter by Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)} style={styles.select}>
            <option value="all">All</option>
            <option value="product">Product</option>
            <option value="service">Service</option>
          </select>
        </div>

        {loading ? (
          <p style={styles.status}>Loading listings...</p>
        ) : error ? (
          <p style={styles.error}>{error}</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Owner</th>
                  <th style={styles.th}>Created</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((item) => (
                  <tr key={item.listing_id} style={styles.tr}>
                    <td style={styles.td}>{item.title}</td>
                    <td style={styles.td}>{capitalize(item.type)}</td>
                    <td style={styles.td}>{item.category}</td>
                    <td style={styles.td}>{item.username}</td>
                    <td style={styles.td}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
  );
}

function capitalize(word) {
  return word?.charAt(0).toUpperCase() + word?.slice(1);
}

const styles = {
  container: {
    padding: '2rem',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#14532d',
    marginBottom: '1.5rem',
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  label: {
    fontWeight: 500,
    fontSize: '0.95rem',
  },
  select: {
    padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    border: '1px solid #d1d5db',
  },
  status: {
    fontSize: '1rem',
    color: '#6b7280',
  },
  error: {
    fontSize: '1rem',
    color: '#dc2626',
  },
  tableWrapper: {
    overflowX: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '700px',
  },
  thead: {
    backgroundColor: '#f9fafb',
    textAlign: 'left',
    fontSize: '0.9rem',
  },
  th: {
    padding: '0.75rem 1rem',
    fontWeight: 600,
    color: '#374151',
    borderBottom: '1px solid #e5e7eb',
  },
  tr: {
    borderBottom: '1px solid #e5e7eb',
  },
  td: {
    padding: '0.75rem 1rem',
    fontSize: '0.95rem',
    color: '#1f2937',
  },
};
