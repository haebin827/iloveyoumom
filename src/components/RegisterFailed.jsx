import { useNavigate } from 'react-router-dom';
import Button from './commons/Button.jsx';
import '../assets/styles/RegisterFailed.css';

const RegisterFailed = ({ error }) => {
    const nav = useNavigate();

    const handleReturnToRegister = () => {
        nav('/register', { replace: true });
    };

    return (
        <div className="error-container">
            <div className="register-container">
                <div className="register-card">
                    <div className="register-form-container">
                        <div className="register-title">인증 실패</div>
                        <div className="register-title-border"></div>
                        
                        <div className="error-message">
                            {error}
                        </div>
                        
                        <div className="error-description">
                            인증 링크가 만료되었거나 잘못된 링크일 수 있습니다.
                        </div>
                    </div>

                    <Button
                        onClick={handleReturnToRegister}
                        className="register-button"
                        color="yellow"
                        size="large"
                        text="회원가입 페이지로 돌아가기"
                        style={{ width: '100%', padding: '12px 24px', fontWeight: 700 }}
                    />
                </div>
            </div>
        </div>
    );
}

export default RegisterFailed;