import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';

const ProtectedRoute = ({ children }) => {
  const session = useAuthStore((state) => state.session);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return (
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
