import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/pages/errors/Error404.css';

function Error404() {
  return (
    <div className="error-404-container">
      <div className="error-404-card">
        <h1 className="error-404-title">
          404
        </h1>
        <h2 className="error-404-subtitle">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="error-404-description">
          요청하신 페이지에 접근할 수 없습니다. 
          비밀번호 인증이 필요하거나 잘못된 주소일 수 있습니다.
        </p>
        <Link to="/" className="error-404-link">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default Error404; 