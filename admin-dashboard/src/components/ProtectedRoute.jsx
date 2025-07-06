// src/components/ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@context/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user || !user.token || !user.admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
