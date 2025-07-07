import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import PasswordChangeModal from '../PasswordChangeModal.jsx';
import '../../styles/Navbar.css';
import logo from '../../assets/logo.png';

export function TabButton({ children, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`tab-button ${active ? 'active' : ''}`}
        >
            {children}
        </button>
    );
}

function Navbar({ activeTab, setActiveTab }) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // 로그아웃 처리 함수
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const openPasswordModal = () => {
        setShowPasswordModal(true);
    };

    const closePasswordModal = () => {
        setShowPasswordModal(false);
    };

    return (
        <>
            <div className="fixed-navbar">
                <div className="navbar-container">
                    {/* 헤더 */}
                    <div className="navbar-header">
                        <div className="navbar-title">
                            <img src={logo} alt="엄마 옷가게 로고" className="navbar-logo" />
                        </div>
                        <div className="navbar-actions">
                            <button 
                                onClick={openPasswordModal}
                                className="change-password-button"
                                title="비밀번호 변경"
                            >
                                비밀번호 변경
                            </button>
                            <button 
                                onClick={handleLogout}
                                className="logout-button"
                            >
                                로그아웃
                            </button>
                        </div>
                    </div>
                    
                    {/* 탭 메뉴 */}
                    <div className="tab-container">
                        <TabButton 
                            active={activeTab === 'customers'} 
                            onClick={() => setActiveTab('customers')}
                        >
                            고객 관리
                        </TabButton>
                        <TabButton 
                            active={activeTab === 'register'} 
                            onClick={() => setActiveTab('register')}
                        >
                            고객 등록
                        </TabButton>
                        <TabButton 
                            active={activeTab === 'visits'} 
                            onClick={() => setActiveTab('visits')}
                        >
                            방문 기록
                        </TabButton>
                    </div>
                </div>
            </div>
            
            {/* 비밀번호 변경 모달 */}
            {showPasswordModal && <PasswordChangeModal onClose={closePasswordModal} />}
        </>
    );
}

export default Navbar; 