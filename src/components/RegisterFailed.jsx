import { useNavigate } from 'react-router-dom';
import '../assets/styles/RegisterFailed.css';

function RegisterFailed({ error }) {
    const navigate = useNavigate();

    const handleReturnToRegister = () => {
        navigate('/register', { replace: true });
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

                    <button
                        onClick={handleReturnToRegister}
                        className="register-button"
                    >
                        회원가입 페이지로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RegisterFailed;