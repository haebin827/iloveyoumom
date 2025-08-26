import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider.jsx';
import { supabase } from '../../lib/supabase.js';
import PasswordChangeModal from '../PasswordChangeModal.jsx';
import '../../assets/styles/Navbar.css';
import logo from '../../assets/logo.png'

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
    const { session } = useAuth();
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            navigate('/');
        }
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
                            <div className="navbar-store-name">
                                {session.user.email === import.meta.env.VITE_MOM_EMAIL ? (
                                        <img src={logo} alt="엄마 옷가게 로고" className="navbar-logo"/>) :
                                    (session.user.user_metadata?.store_name || '오까게')}
                            </div>
                        </div>
                        <div className="navbar-actions">
                            <div className="name">
                                {session.user.user_metadata?.full_name && `안녕하세요, ${session.user.user_metadata.full_name}님!`}
                            </div>
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