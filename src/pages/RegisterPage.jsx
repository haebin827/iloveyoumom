import { useState } from 'react';
import {Link, Navigate} from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';
import { supabase } from '../lib/supabase.js';
import Button from '../components/commons/Button.jsx';
import '../assets/styles/RegisterPage.css';

const RegisterPage = () => {
    const session = useAuthStore((state) => state.session);

    const [formData, setFormData] = useState({
        name: '',
        storeName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    if (session) {
        return <Navigate to="/main" replace />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            const digits = value.replace(/\D/g, ''); // Remove all non-digits
            if (digits.length <= 11) { // Only allow up to 11 digits
                setFormData(prevState => ({
                    ...prevState,
                    [name]: digits
                }));
            }
            return;
        }
        
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const getPasswordStrength = (password) => {
        if (password.length === 0) return '';
        if (password.length < 6) return 'weak';
        if (password.length < 10) return 'medium';
        return 'strong';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('비밀번호는 최소 6자 이상이어야 합니다.');
            setLoading(false);
            return;
        }

        if (!formData.name.trim()) {
            setError('이름을 입력해주세요.');
            setLoading(false);
            return;
        }

        if (!formData.storeName.trim()) {
            setError('매장 이름을 입력해주세요.');
            setLoading(false);
            return;
        }

        if (!formData.phone.trim()) {
            setError('전화번호를 입력해주세요.');
            setLoading(false);
            return;
        }

        // Phone number validation: must be exactly 11 digits
        const phoneDigits = formData.phone.replace(/\D/g, '');
        if (phoneDigits.length !== 11) {
            setError('전화번호는 11자리 숫자여야 합니다.');
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    emailRedirectTo: `${window.location.origin + import.meta.env.VITE_AUTH_CALLBACK_PATH}`,
                    data: {
                        full_name: formData.name.trim(),
                        store_name: formData.storeName.trim(),
                        phone: formData.phone.trim()
                    }
                }
            });

            if (error) {
                setError(error.message === `Email address "${formData.email}" is invalid` ? "유효하지 않은 이메일입니다." : "문제가 발생했습니다. 개발자에게 문의해주세요 :)");
            } else {
                setMessage('가입 확인 이메일이 발송되었습니다. 이메일을 확인해주세요.');
                setFormData({ name: '', storeName: '', phone: '', email: '', password: '', confirmPassword: '' });
            }
        } catch (err) {
            setError('회원가입 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-container">
            <div className="register-container">
                <div className={`register-card`}>
                    <form onSubmit={handleSubmit}>
                        <div className="register-form-container">
                            <div className="register-title">회원가입</div>
                            <div className="register-title-border"></div>

                            <div className="form-field">
                                <label htmlFor="name" className="form-label">이름</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="이름을 입력하세요"
                                    className={`form-input`}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="storeName" className="form-label">매장 이름</label>
                                <input
                                    id="storeName"
                                    type="text"
                                    name="storeName"
                                    value={formData.storeName}
                                    onChange={handleChange}
                                    placeholder="매장 이름을 입력하세요"
                                    className={`form-input`}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="phone" className="form-label">전화번호</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="(예: 01012345678)"
                                    className={`form-input`}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="email" className="form-label">이메일</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="이메일을 입력하세요"
                                    className={`form-input`}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="password" className="form-label">비밀번호</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="비밀번호를 입력하세요"
                                    className={`form-input`}
                                    required
                                />
                                {formData.password && (
                                    <div className={`password-strength ${getPasswordStrength(formData.password)}`}>
                                        {getPasswordStrength(formData.password) === 'weak' && '약함'}
                                        {getPasswordStrength(formData.password) === 'medium' && '보통'}
                                        {getPasswordStrength(formData.password) === 'strong' && '강함'}
                                    </div>
                                )}
                            </div>

                            <div className="form-field">
                                <label htmlFor="confirmPassword" className="form-label">비밀번호 확인</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="비밀번호를 다시 입력하세요"
                                    className={`form-input`}
                                    required
                                />
                            </div>

                            {error && <div className="error-message">{error}</div>}
                            {message && <div className="success-message">{message}</div>}
                        </div>

                        <Button
                            type="submit"
                            className="register-button"
                            color="yellow"
                            size="large"
                            text={loading ? '가입 중...' : '회원가입'}
                            disabled={loading}
                            style={{ width: '100%', padding: '12px 24px', fontWeight: 700 }}
                        />

                        <div className="register-link-container">
                            <span className="register-link-text">이미 계정이 있으신가요? </span>
                            <Link to="/" className="register-link">로그인</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;