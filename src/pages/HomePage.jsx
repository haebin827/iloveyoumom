import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function HomePage() {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    
    // 인증 컨텍스트 사용
    const { authenticated, login } = useAuth();

    // 화면 크기 변경 감지
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 이미 인증된 사용자는 MainPage로 리디렉션
    if (authenticated) {
        return <Navigate to="/main" replace />;
    }

    const handleChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        
        if (!password) {
            setMessage('비밀번호를 입력해주세요.');
            setLoading(false);
            return;
        }
        
        try {
            // AuthContext의 login 함수 사용
            const result = await login(password);
            
            if (result.success) {
                setMessage('비밀번호가 확인되었습니다.');
                // 인증 성공 시 리디렉션은 위의 if(authenticated) 조건에서 처리됨
            } else {
                setMessage(result.error || '잘못된 비밀번호입니다. 다시 시도해주세요.');
            }
        } catch (err) {
            console.error('오류 발생:', err);
            setMessage('오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: 'calc(100vh - var(--navbar-height))'
        }}>
            <div className="password-container" style={{
                width: '100%',
                maxWidth: isMobile ? '300px' : '400px',
                textAlign: 'center'
            }}>
                
                <div className="card" style={{
                    backgroundColor: 'white',
                    boxShadow: 'var(--box-shadow)',
                    border: '1px solid #e6b800',
                    borderRadius: 'var(--border-radius)',
                    padding: isMobile ? '1.5rem' : '2rem'
                }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: isMobile ? '1.2rem' : '1.5rem' }}>
                            <input
                                type="password"
                                value={password}
                                onChange={handleChange}
                                placeholder="비밀번호를 입력하세요"
                                autoFocus
                                disabled={loading}
                                style={{
                                    border: '1px solid #e6b800',
                                    borderRadius: 'var(--border-radius)',
                                    padding: isMobile ? '10px 14px' : '12px 16px',
                                    width: '100%',
                                    fontSize: isMobile ? '14px' : '16px'
                                }}
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{
                                backgroundColor: 'var(--primary-color)',
                                color: 'black',
                                border: 'none',
                                borderRadius: 'var(--border-radius)',
                                padding: isMobile ? '10px 20px' : '12px 24px',
                                width: '100%',
                                fontSize: isMobile ? '14px' : '16px',
                                fontWeight: 'bold',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? '로그인 중...' : '로그인'}
                        </button>
                    </form>
                    
                    {message && (
                        <p className={authenticated ? 'success-message' : 'error-message'} style={{
                            marginTop: '1rem',
                            fontSize: isMobile ? '14px' : '16px'
                        }}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomePage; 