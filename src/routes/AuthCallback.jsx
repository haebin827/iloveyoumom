import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import RegisterConfirmed from '../components/RegisterConfirmed.jsx';
import RegisterFailed from '../components/./RegisterFailed.jsx';

const AuthCallback = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [session, setSession] = useState(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error');
          setError('인증 처리 중 오류가 발생했습니다.');
          setLoading(false);
          return;
        }

        if (data.session) {
          setSession(data.session);
          setLoading(false);
        } else {
          setError('세션을 확인할 수 없습니다.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Callback processing error');
        setError('인증 처리 중 예기치 못한 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [nav]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div>인증 처리 중...</div>
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          잠시만 기다려주세요.
        </div>
      </div>
    );
  }

  if (error) {
    return <RegisterFailed error={error} />;
  }

  if (session) {
    const userName = session.user.user_metadata?.full_name || session.user.email;
    return <RegisterConfirmed userName={userName} />;
  }

  return null;
}

export default AuthCallback;