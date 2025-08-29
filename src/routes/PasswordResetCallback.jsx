import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import PasswordResetConfirmed from '../components/PasswordResetConfirmed.jsx';
import PasswordResetFailed from '../components/PasswordResetFailed.jsx';

function PasswordResetCallback() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [session, setSession] = useState(null);

  useEffect(() => {
    const handlePasswordResetCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Password reset callback error:', error);
          setError('비밀번호 재설정 처리 중 오류가 발생했습니다.');
          setLoading(false);
          return;
        }

        if (data.session) {
          console.log('Password reset session confirmed:', data.session);
          setSession(data.session);
          setLoading(false);
        } else {
          setError('비밀번호 재설정 세션을 확인할 수 없습니다.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Password reset callback processing error:', err);
        setError('비밀번호 재설정 처리 중 예기치 못한 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    handlePasswordResetCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div>비밀번호 재설정 처리 중...</div>
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          잠시만 기다려주세요.
        </div>
      </div>
    );
  }

  if (error) {
    return <PasswordResetFailed error={error} />;
  }

  if (session) {
    return <PasswordResetConfirmed session={session} />;
  }

  return null;
}

export default PasswordResetCallback;