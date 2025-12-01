import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';
import useUIStore from '../../stores/useUIStore';
import PasswordChangeModal from '../PasswordChangeModal.jsx';
import '../../assets/styles/components/Navbar.css';
import logo from '../../assets/logo.png';

export const TabButton = ({ children, active, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`tab-button ${active ? 'active' : ''}`}
        >
            {children}
        </button>
    );
}

const Navbar = () => {
    const nav = useNavigate();
    const session = useAuthStore((state) => state.session);
    const signOut = useAuthStore((state) => state.signOut);
    const activeTab = useUIStore((state) => state.activeTab);
    const setActiveTab = useUIStore((state) => state.setActiveTab);

    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut();
            nav('/');
        } catch (error) {
            console.error('Logout error');
            nav('/');
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
                    {/* header */}
                    <div className="navbar-header">
                        <div className="navbar-title">
                            <div className="navbar-store-name">
                                {session?.user?.email === import.meta.env.VITE_MOM_EMAIL ? (
                                        <img src={logo} alt="엄마 옷가게 로고" className="navbar-logo"/>) :
                                    (session?.user?.user_metadata?.store_name || '오까게')}
                            </div>
                        </div>
                        <div className="navbar-actions">
                            <div className="name">
                                {session?.user?.user_metadata?.full_name && `안녕하세요, ${session?.user?.user_metadata.full_name}님!`}
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

                    {/* tab menu */}
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
                            구매 기록
                        </TabButton>
                        <TabButton
                            active={activeTab === 'sms'}
                            onClick={() => setActiveTab('sms')}
                        >
                            문자 관리
                        </TabButton>
                    </div>
                </div>
            </div>

            {/* password change modal */}
            {showPasswordModal && <PasswordChangeModal onClose={closePasswordModal} />}
        </>
    );
}

export default Navbar;
