import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

// 인증된 사용자만 접근할 수 있는 보호된 라우트 컴포넌트
function ProtectedRoute({ children }) {
  const { authenticated, loading } = useAuth();

  // 로딩 중일 때는 로딩 표시
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

  // 인증되지 않은 사용자는 404 페이지로 리디렉션
  if (!authenticated) {
    return <Navigate to="/404" replace />;
  }

  // 인증된 사용자는 자식 컴포넌트 렌더링
  return children;
}

export default ProtectedRoute; 