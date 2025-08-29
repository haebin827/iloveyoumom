import { useNavigate } from 'react-router-dom';

function PasswordResetFailed({ error }) {
    const navigate = useNavigate();

    const handleReturnToLogin = () => {
        navigate('/', { replace: true });
    };

    return (
        <div className="error-container">
            <div className="register-container">
                <div className="register-card">
                    <div className="register-form-container">
                        <div className="register-title">비밀번호 재설정 실패</div>
                        <div className="register-title-border"></div>
                        
                        <div className="error-message">
                            {error}
                        </div>
                        
                        <div className="error-description">
                            비밀번호 재설정 링크가 만료되었거나 잘못된 링크일 수 있습니다.
                            다시 비밀번호 재설정을 요청해주세요.
                        </div>
                    </div>

                    <button
                        onClick={handleReturnToLogin}
                        className="register-button"
                    >
                        로그인 페이지로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PasswordResetFailed;