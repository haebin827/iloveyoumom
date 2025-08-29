import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import '../assets/styles/PasswordResetConfirmed.css';
import {IoMdInformationCircle} from "react-icons/io";

function PasswordResetConfirmed({ session }) {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      setMessage('비밀번호를 입력해주세요.');
      return;
    }

    if (newPassword.length < 8) {
      setMessage('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }
    
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      setMessage('비밀번호는 대문자, 소문자, 숫자, 특수문자를 각각 포함해야 합니다.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        setMessage(error.message || '비밀번호 변경에 실패했습니다.');
      } else {
        setSuccess(true);
        setMessage('비밀번호가 성공적으로 변경되었습니다.');
        setTimeout(() => {
          navigate('/main');
        }, 2000);
      }
    } catch (err) {
      console.error('Password update error:', err);
      setMessage('비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-reset-container">
      <div className="password-reset-modal">
        <div className="password-modal-header">
          <h2>새 비밀번호 설정</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="password-modal-form">
          <div className="form-group-header">
            <p className="form-group-desc">
              새로운 비밀번호를 설정해주세요.
            </p>
            <div className="password-requirements-container">
              <div className="password-requirements-trigger">
                <IoMdInformationCircle />
                비밀번호 조건
              </div>
              <div className="password-requirements-tooltip">
                <ul>
                  <li>최소 8자 이상</li>
                  <li>대문자 포함</li>
                  <li>소문자 포함</li>
                  <li>숫자 포함</li>
                  <li>특수문자 포함</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">새 비밀번호</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading || success}
              placeholder="새 비밀번호를 입력하세요"
              className="password-reset-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">새 비밀번호 재입력</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading || success}
              placeholder="새 비밀번호를 다시 입력하세요"
              className="password-reset-input"
            />
          </div>
          
          {message && (
            <div className={`message ${success ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          
          <div className="form-actions password-reset-actions">
            <button 
              type="submit" 
              className="password-reset-submit-button"
              disabled={loading || success}
            >
              {loading ? '변경 중...' : success ? '변경 완료' : '비밀번호 변경'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordResetConfirmed;