import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  FiHome, FiUsers, FiList, FiAlertCircle,
  FiBell, FiSettings, FiLogOut, FiUser,
  FiSun, FiMoon
} from 'react-icons/fi';
import { useAuth } from '@context/AuthContext';
import { useTheme } from '@context/ThemeContext';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
  { label: 'Users', path: '/users', icon: <FiUsers /> },
  { label: 'Listings', path: '/listings', icon: <FiList /> },
  { label: 'Reports', path: '/reports', icon: <FiAlertCircle /> },
  { label: 'Notifications', path: '/notifications', icon: <FiBell /> },
  { label: 'Settings', path: '/settings', icon: <FiSettings /> },
];

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const theme = darkMode ? darkStyles : lightStyles;

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div style={theme.container}>
      {/* Sidebar */}
      <aside style={theme.sidebar}>
        <div style={theme.logoSection}>
          <h1 style={theme.logo}>AgriAdmin</h1>
        </div>

        <nav style={theme.nav}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...theme.navLink,
                ...(pathname === item.path ? theme.activeNavLink : {})
              }}
            >
              <span style={theme.icon}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <button style={theme.logoutBtn} onClick={logout}>
          <FiLogOut style={{ marginRight: '0.5rem' }} />
          Logout
        </button>
      </aside>

      {/* Main */}
      <main style={theme.main}>
        <header style={theme.header}>
          <h2 style={theme.pageTitle}>{getPageTitle(pathname)}</h2>

          <div style={theme.headerRight}>
            {/* Theme Toggle */}
            <button onClick={toggleTheme} style={theme.toggleBtn}>
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>

            {/* Profile */}
            <div style={theme.profileContainer} onClick={handleProfileClick}>
              <div style={theme.profileIcon}>
                <FiUser />
              </div>
              <p style={theme.profileName}>
                {user?.admin?.username || 'Admin'}
              </p>
            </div>
          </div>
        </header>

        <div style={theme.pageContent}>
           <Outlet /> 
        </div>
      </main>
    </div>
  );
}

function getPageTitle(path) {
  if (path.includes('/users')) return 'Manage Users';
  if (path.includes('/listings')) return 'View Listings';
  if (path.includes('/reports')) return 'Report Management';
  if (path.includes('/notifications')) return 'Notifications';
  if (path.includes('/settings')) return 'Settings';
  if (path.includes('/profile')) return 'My Profile';
  return 'Dashboard';
}

const baseStyles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Inter, sans-serif',
  },
  sidebar: {
    width: '240px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    padding: '1.5rem 1rem',
    overflowY: 'auto',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontWeight: 500,
  },
  icon: {
    fontSize: '1.2rem',
    marginRight: '0.75rem',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.25rem',
    cursor: 'pointer',
    color: 'inherit',
    marginRight: '1rem',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    padding: '0.4rem 0.75rem',
    borderRadius: '0.5rem',
  },
  profileIcon: {
    padding: '0.5rem',
    borderRadius: '50%',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontWeight: '600',
    fontSize: '0.9rem',
  },
};

const lightStyles = {
  ...baseStyles,
  container: {
    ...baseStyles.container,
    backgroundColor: '#f0fdf4',
  },
  sidebar: {
    ...baseStyles.sidebar,
    backgroundColor: '#166534',
    color: '#f0fdf4',
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#bbf7d0',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  navLink: {
    ...baseStyles.navLink,
    color: '#d1fae5',
  },
  activeNavLink: {
    backgroundColor: '#14532d',
    color: '#ffffff',
  },
  logoutBtn: {
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    marginTop: '2rem',
  },
  main: {
    marginLeft: '240px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  header: {
    padding: '1rem 2rem',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#14532d',
  },
  pageContent: {
    padding: '2rem',
    backgroundColor: '#f0fdf4',
    flex: 1,
  },
  profileContainer: {
    ...baseStyles.profileContainer,
    backgroundColor: '#bbf7d0',
  },
  profileIcon: {
    ...baseStyles.profileIcon,
    backgroundColor: '#14532d',
    color: '#ffffff',
  },
  profileName: {
    ...baseStyles.profileName,
    color: '#14532d',
  },
};

const darkStyles = {
  ...lightStyles,
  container: {
    ...baseStyles.container,
    backgroundColor: '#0f172a',
  },
  sidebar: {
    ...baseStyles.sidebar,
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
  },
  navLink: {
    ...baseStyles.navLink,
    color: '#cbd5e1',
  },
  activeNavLink: {
    backgroundColor: '#334155',
    color: '#ffffff',
  },
  logo: {
    ...lightStyles.logo,
    color: '#38bdf8',
  },
  logoutBtn: {
    ...lightStyles.logoutBtn,
    backgroundColor: '#ef4444',
  },
  header: {
    ...lightStyles.header,
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    borderBottom: '1px solid #334155',
  },
  pageTitle: {
    ...lightStyles.pageTitle,
    color: '#f8fafc',
  },
  pageContent: {
    ...lightStyles.pageContent,
    backgroundColor: '#0f172a',
  },
  profileContainer: {
    ...baseStyles.profileContainer,
    backgroundColor: '#334155',
  },
  profileIcon: {
    ...baseStyles.profileIcon,
    backgroundColor: '#38bdf8',
    color: '#0f172a',
  },
  profileName: {
    ...baseStyles.profileName,
    color: '#e2e8f0',
  },
};
