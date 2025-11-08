import { useNavigate } from 'react-router-dom';
import Button from './commons/Button.jsx';
import '../assets/styles/RegisterConfirmed.css';

const RegisterConfirmed = ({ userName }) => {
    const nav = useNavigate();

    const handleGoHome = () => {
        nav('/', { replace: true });
    };

    return (
        <div className="home-container">
            <div className="register-container">
                <div className="register-card">
                    <div className="register-form-container">
                        <div className="register-title">가입 완료</div>
                        <div className="register-title-border"></div>
                        
                        <div className="welcome-message">
                            환영해요, {userName}님!<br />
                            시작할 준비 되셨나요? ☺️
                        </div>
                        
                        <div className="success-message">
                            이메일 인증이 성공적으로 완료되었습니다.
                        </div>
                    </div>

                    <Button
                        onClick={handleGoHome}
                        className="register-button"
                        color="yellow"
                        size="large"
                        text="홈으로"
                        style={{ width: '100%', padding: '12px 24px', fontWeight: 700 }}
                    />
                </div>
            </div>
        </div>
    );
}

export default RegisterConfirmed;