import { useEffect, useState } from 'react';
import api from '../api/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { FiUsers, FiActivity, FiList } from 'react-icons/fi';
import AdminLayout from '@components/AdminLayout';

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, activeUsers: 0, listings: 0 });
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get('/admin/dashboardStats');
        setStats(res.data);
        setGraphData([
          { name: 'Users', value: res.data.users },
          { name: 'Active', value: res.data.activeUsers },
          { name: 'Listings', value: res.data.listings },
        ]);
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    }

    fetchStats();
  }, []);

  return (
    
      <div style={styles.wrapper}>
        <section style={styles.cardGrid}>
          <StatCard icon={<FiUsers />} label="Total Users" value={stats.users} />
          <StatCard icon={<FiActivity />} label="Active Users" value={stats.activeUsers} />
          <StatCard icon={<FiList />} label="Listings" value={stats.listings} />
        </section>

        <section style={styles.chartSection}>
          <h2 style={styles.chartTitle}>Analytics Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={graphData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div style={styles.card}>
      <div style={styles.icon}>{icon}</div>
      <p style={styles.label}>{label}</p>
      <h3 style={styles.value}>{value}</h3>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: '2rem',
    backgroundColor: '#f9fafb',
    minHeight: '100%',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '1.75rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  icon: {
    fontSize: '1.75rem',
    color: '#10b981',
    marginBottom: '0.5rem',
  },
  label: {
    fontSize: '0.9rem',
    color: '#6b7280',
    marginBottom: '0.3rem',
  },
  value: {
    fontSize: '1.75rem',
    fontWeight: '600',
    color: '#1f2937',
  },
  chartSection: {
    backgroundColor: '#ffffff',
    padding: '1.75rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
  },
  chartTitle: {
    fontSize: '1.25rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '1rem',
  },
};
