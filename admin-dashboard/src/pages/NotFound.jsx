// /admin-dashboard/src/pages/NotFound.jsx

export default function NotFound() {
  return (
    <div style={styles.container}>
      <h1 style={styles.code}>404</h1>
      <p style={styles.message}>Oops! Page not found.</p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    color: '#1f2937',
  },
  code: {
    fontSize: '6rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#10b981',
  },
  message: {
    fontSize: '1.5rem',
    textAlign: 'center',
  },
};
