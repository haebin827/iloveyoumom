import { useNavigate } from 'react-router-dom';
import '../assets/styles/RegisterConfirmed.css';

function RegisterConfirmed({ userName }) {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/', { replace: true });
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

                    <button
                        onClick={handleGoHome}
                        className="register-button"
                    >
                        홈으로
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RegisterConfirmed;