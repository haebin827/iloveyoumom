import React from 'react';
import { Link } from 'react-router-dom';

function Error404() {
  return (
    <div className="container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh'
    }}>
      <div className="card" style={{ 
        maxWidth: '500px', 
        textAlign: 'center',
        padding: '2.5rem',
        backgroundColor: 'white',
        border: '1px solid var(--primary-light)'
      }}>
        <h1 style={{ 
          background: 'linear-gradient(45deg, var(--primary-dark), var(--primary-color))',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent'
        }}>
          404
        </h1>
        <h2 style={{ 
          marginBottom: '1.5rem', 
          color: 'var(--text-light)'
        }}>
          페이지를 찾을 수 없습니다
        </h2>
        <p style={{ marginBottom: '2rem' }}>
          요청하신 페이지에 접근할 수 없습니다. 
          비밀번호 인증이 필요하거나 잘못된 주소일 수 있습니다.
        </p>
        <Link 
          to="/" 
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 'var(--border-radius)',
            fontWeight: '600',
            boxShadow: 'var(--box-shadow)'
          }}
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default Error404; 