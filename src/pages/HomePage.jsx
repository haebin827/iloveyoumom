import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider.jsx';
import { supabase } from '../lib/supabase.js';
import '../assets/styles/pages/HomePage.css';

function HomePage() {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { session } = useAuth();

    if (session) {
        return <Navigate to="/main" replace />;
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value.trim()
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        
        if(!loginData.email || !loginData.password) {
            setMessage('이메일/비밀번호를 입력해주세요.')
            setLoading(false);
            return;
        }
        
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: loginData.email,
                password: loginData.password,
            });
            
            if (error) {
                setMessage('잘못된 이메일/비밀번호입니다. 다시 시도해주세요.');
            }
        } catch (err) {
            console.error('로그인 오류:', err);
            setMessage('이메일/비밀번호가 일치하지 않습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-container">
            <div className={`login-container`}>
                <div className="login-logo">
                        오까게
                </div>
                <div className="login-title">안녕하세요, 옷을 파는 오까게입니다 *^^*</div>
                <div className={`login-card`}>
                    <form onSubmit={handleSubmit}>
                        <div className={`input-container`}>
                            <input
                                type="email"
                                name="email"
                                value={loginData.email}
                                onChange={handleChange}
                                placeholder="이메일"
                                autoFocus
                                disabled={loading}
                                className={`username-input`}
                            />
                            <input
                                type="password"
                                name="password"
                                value={loginData.password}
                                onChange={handleChange}
                                placeholder="비밀번호"
                                disabled={loading}
                                className={`password-input`}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`login-button`}
                        >
                            {loading ? '로그인 중...' : '로그인'}
                        </button>

                        <div className="register-link-container">
                            <span className="register-link-text">회원가입이 필요하신가요? </span>
                            <Link to="/register" className="register-link">회원가입</Link>
                        </div>
                        {message && (
                            <p className={`message error-message`}>
                                {message}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default HomePage; 