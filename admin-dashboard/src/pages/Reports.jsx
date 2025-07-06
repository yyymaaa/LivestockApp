import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@components/AdminLayout';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [formData, setFormData] = useState({ report_type: '', content: '' });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await axios.get('/api/admin/reports');
        headers: {
          Authorization: `Bearer ${yourTokenHere}`
        }
        console.log("Fetched reports:", res.data);
        setReports(res.data);
      } catch (err) {
        console.error('Error fetching reports', err);
      }
    }
    fetchReports();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/reports', formData);
      setMessage({ text: 'Report created successfully.', type: 'success' });
      setFormData({ report_type: '', content: '' });
      setReports([...reports, res.data]);
    } catch (err) {
      console.error('Error creating report', err);
      setMessage({ text: 'Failed to create report.', type: 'error' });
    }
  };

  return (
      <div style={styles.container}>
        <h1 style={styles.heading}>Reports</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.subheading}>Create New Report</h2>

          <div style={styles.formGroup}>
            <label style={styles.label}>Report Type</label>
            <input
              type="text"
              name="report_type"
              value={formData.report_type}
              onChange={handleChange}
              placeholder="e.g. User Feedback, System Overview"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="4"
              required
              style={styles.textarea}
            />
          </div>

          <button type="submit" style={styles.button}>
            Submit Report
          </button>

          {message && (
            <p style={message.type === 'success' ? styles.successMsg : styles.errorMsg}>
              {message.text}
            </p>
          )}
        </form>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Content</th>
                <th style={styles.th}>Created</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(reports) && reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report.report_id}>
                  <td>{report.report_type}</td>
                  <td>{report.content}</td>
                  <td>{new Date(report.created_at).toLocaleDateString()}</td>
                </tr>
              ))
              ) : (
              <tr>
                <td colSpan="3">No reports available.</td>
              </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
  },
  heading: {
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#14532d',
    marginBottom: '2rem',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    marginBottom: '2rem',
    maxWidth: '700px',
  },
  subheading: {
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: '#1f2937',
  },
  formGroup: {
    marginBottom: '1.25rem',
  },
  label: {
    display: 'block',
    fontWeight: 500,
    fontSize: '0.95rem',
    marginBottom: '0.5rem',
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    resize: 'vertical',
  },
  button: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '0.6rem 1.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    borderRadius: '0.5rem',
    cursor: 'pointer',
    border: 'none',
    marginTop: '0.5rem',
  },
  successMsg: {
    marginTop: '0.75rem',
    fontSize: '0.9rem',
    color: '#059669',
  },
  errorMsg: {
    marginTop: '0.75rem',
    fontSize: '0.9rem',
    color: '#dc2626',
  },
  tableWrapper: {
    overflowX: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '700px',
  },
  thead: {
    backgroundColor: '#f3f4f6',
    textAlign: 'left',
    fontSize: '0.9rem',
  },
  th: {
    padding: '0.75rem 1rem',
    fontWeight: 600,
    color: '#1f2937',
    borderBottom: '1px solid #e5e7eb',
  },
  tr: {
    borderBottom: '1px solid #e5e7eb',
  },
  td: {
    padding: '0.75rem 1rem',
    fontSize: '0.95rem',
    color: '#374151',
    verticalAlign: 'top',
    whiteSpace: 'pre-wrap',
  },
};
