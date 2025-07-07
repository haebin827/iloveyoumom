import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { authenticated, loading } = useAuth();

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

  if (!authenticated) {
    return <Navigate to="/404" replace />;
  }

  return children;
}

export default ProtectedRoute; 