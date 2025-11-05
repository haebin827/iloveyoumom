import React, { useState } from 'react';
import { useAuth } from '../providers/AuthProvider.jsx';
import { supabase } from '../lib/supabase.js';
import Button from './commons/Button.jsx';
import '../assets/styles/PasswordChangeModal.css';

function PasswordChangeModal({ onClose }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { session } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!session?.user?.email) {
      setMessage('로그인된 사용자 정보를 찾을 수 없습니다.');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(session.user.email, {
        redirectTo: `${window.location.origin}/password-reset/callback`
      });
      
      if (error) {
        setMessage(error.message || '비밀번호 재설정 이메일 전송에 실패했습니다.');
      } else {
        setSuccess(true);
        setMessage('비밀번호 재설정 링크가 이메일로 전송되었습니다. 링크는 5분간 유효합니다.');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setMessage('비밀번호 재설정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="password-modal-overlay">
      <div className="password-modal">
        <div className="password-modal-header">
          <h2>비밀번호 변경</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="password-modal-form">
          <div className="form-group">
            <p>현재 로그인된 이메일 주소로 비밀번호 재설정 링크를 전송합니다.</p>
            <p>링크는 <b>5분간</b> 유효합니다.</p>
            <p className="form-group-email"><strong>이메일:</strong> {session?.user?.email}</p>
          </div>
          
          {message && (
            <div className={`message ${success ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          
          <div className="form-actions">
            <Button
              type="button"
              className="cancel-button"
              color="light"
              size="medium"
              text="취소"
              onClick={onClose}
              disabled={loading}
            />
            <Button
              type="submit"
              className="save-button"
              color="yellow"
              size="medium"
              text={loading ? '전송 중...' : success ? '전송 완료' : '재설정 링크 전송'}
              disabled={loading || success}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordChangeModal; 