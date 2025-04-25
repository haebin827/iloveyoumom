import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/PasswordChangeModal.css';

function PasswordChangeModal({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { changePassword } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword) {
      setMessage('모든 필드를 입력해주세요.');
      return;
    }
    
    if (currentPassword === newPassword) {
      setMessage('새 비밀번호가 현재 비밀번호와 동일합니다.');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const result = await changePassword(currentPassword, newPassword);
      
      if (result.success) {
        setSuccess(true);
        setMessage('비밀번호가 성공적으로 변경되었습니다.');
        // 폼 초기화
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setMessage(result.error || '비밀번호 변경에 실패했습니다.');
      }
    } catch (err) {
      console.error('비밀번호 변경 중 오류:', err);
      setMessage('비밀번호 변경 중 오류가 발생했습니다.');
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
            <label htmlFor="current-password">현재 비밀번호</label>
            <input 
              type="password" 
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={loading || success}
              placeholder="현재 비밀번호 입력"
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="new-password">새 비밀번호</label>
            <input 
              type="password" 
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading || success}
              placeholder="새 비밀번호 입력"
            />
          </div>
          
          {message && (
            <div className={`message ${success ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              취소
            </button>
            <button 
              type="submit" 
              className="save-button"
              disabled={loading || success}
            >
              {loading ? '변경 중...' : success ? '변경 완료' : '변경하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordChangeModal; 