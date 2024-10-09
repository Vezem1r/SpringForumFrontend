import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaSignInAlt, FaChevronDown, FaBell, FaCog, FaComment } from 'react-icons/fa';
import LoginModal from '../modals/LoginModal';
import RegisterModal from '../modals/RegisterModal';
import ForgotPasswordModal from '../modals/ForgetPasswordModal';
import VerificationModal from '../modals/VerificationModal';
import { AuthContext } from '../context/AuthContext';
import UploadAvatarModal from '../modals/UploadAvatarModal';
import ChangeUsernameModal from '../modals/ChangeUsernameModal';
import ChatModal from '../modals/ChatModal';

const Header = () => {
    const { isLoggedIn, username, login, logout } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [prefilledEmail, setPrefilledEmail] = useState('');
    const [verificationEmail, setVerificationEmail] = useState('');
    const [modalType, setModalType] = useState('');
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [uploadAvatarModalVisible, setUploadAvatarModalVisible] = useState(false);
    const [changeUsernameModalVisible, setChangeUsernameModalVisible] = useState(false);
    const [chatModalVisible, setChatModalVisible] = useState(false);

    // useEffect(() => {}, [isLoggedIn, username, login, logout])

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const openModal = (type) => {
        setModalType(type);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setModalType('');
    };

    const handleLogin = (token) => {
        login(token);
        setMenuOpen(false);
        closeModal();
    };

    const handleRegister = (email) => {
        setVerificationEmail(email);
        setModalType('verify');
        setModalVisible(true);
        openModal('verify');
    };

    const handleVerified = (email) => {
        setPrefilledEmail(email);
        setModalType('login');
        setModalVisible(true);
        openModal('login');
    };

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
    };

    const handleMessagesClick = () => {
        setChatModalVisible(true);
        setMenuOpen(false);
    };

    const handleUploadAvatarSuccess = (message) => {
        console.log(message);
    };
    
    const handleChangeUsernameSuccess = (loginResponse) => {
        console.log(loginResponse);
    };

    const handleClickOutside = (e) => {
        if (menuOpen && !e.target.closest('.user-menu')) {
            setMenuOpen(false);
            setSettingsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <header className='flex shadow-md py-4 px-4 sm:px-10 bg-white font-sans min-h-[50px] tracking-wide relative z-50'>
            <div className='flex flex-wrap items-center gap-4 w-full'>
                <Link to="/" className='text-purple-600 font-bold text-xl'>
                    Forum
                </Link>

                <div className='flex ml-auto items-center'>
                    {isLoggedIn && (

                        <button>
                            <FaBell className="text-purple-600 cursor-pointer mr-3" onClick={() => console.log("Notification clicked")} />
                        </button>
                    )}

                    <div className="relative user-menu">
                        {!isLoggedIn ? (
                            <button 
                                onClick={() => openModal('login')} 
                                className='flex items-center px-4 py-2 text-purple-600 rounded-md font-semibold border-2 border-transparent hover:border-purple-600'
                                aria-label="Log In"
                            >
                                <FaSignInAlt className='mr-1' />
                                Log In
                            </button>
                        ) : (
                            <>
                                <button 
                                    onClick={toggleMenu} 
                                    className="flex items-center text-purple-600 hover:text-gray-200"
                                    aria-label={`User menu for ${username}`}
                                >
                                    <FaUserCircle className="mr-1" />
                                    {username} <FaChevronDown className="ml-1" />
                                </button>
                                {menuOpen && (
                                    <div className="fixed right-0 bg-white border border-gray-300 shadow-lg mt-4 w-48 rounded-lg z-10">
                                        <button 
                                            onClick={() => window.location.href = `/profile/${username}`} 
                                            className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                                        >
                                            <FaUserCircle className="mr-2" /> Profile
                                        </button>
                                        <button 
                                            onClick={handleMessagesClick}
                                            className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                                        >
                                            <FaComment className="mr-2" /> Messages
                                        </button>
                                        
                                        <div>
                                            <button 
                                                onClick={() => setSettingsOpen((prev) => !prev)} 
                                                className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                                            >
                                                <FaCog className="mr-2" /> Settings <FaChevronDown className="ml-1" />
                                            </button>
                                            {settingsOpen && (
                                                <div className="mt-2 bg-gray-100 rounded-lg shadow-md">
                                                    <button 
                                                        onClick={() => openModal('forgot-password')}
                                                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                                                    >
                                                        Change Password
                                                    </button>
                                                    <button 
                                                        onClick={() => setChangeUsernameModalVisible(true)} 
                                                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                                                    >
                                                        Change Username
                                                    </button>
                                                    <button 
                                                        onClick={() => setUploadAvatarModalVisible(true)}
                                                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                                                    >
                                                        Change Avatar
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <button 
                                            onClick={handleLogout} 
                                            className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                                        >
                                            <FaSignInAlt className="mr-2" /> Logout
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {modalType === 'login' && (
                <LoginModal 
                    isOpen={modalVisible} 
                    onClose={closeModal} 
                    onLogin={handleLogin} 
                    onRegisterClick={() => setModalType('register')}
                    onForgotPasswordClick={() => setModalType('forgot-password')}
                    prefilledEmail={prefilledEmail}
                />
            )}

            {modalType === 'register' && (
                <RegisterModal 
                    isOpen={modalVisible} 
                    onClose={closeModal} 
                    onLoginClick={() => setModalType('login')}
                    onVerificationOpen={handleRegister}
                />
            )}

            {modalType === 'forgot-password' && (
                <ForgotPasswordModal 
                    isOpen={modalVisible} 
                    onClose={closeModal} 
                />
            )}
            {modalType === 'verify' && (
                <VerificationModal 
                    isOpen={modalVisible} 
                    onClose={closeModal} 
                    email={verificationEmail}
                    onEmailVerified={handleVerified}
                />
            )}
            <UploadAvatarModal 
                isOpen={uploadAvatarModalVisible} 
                onClose={() => setUploadAvatarModalVisible(false)} 
                onSuccess={handleUploadAvatarSuccess}
            />

            <ChangeUsernameModal 
                isOpen={changeUsernameModalVisible} 
                onClose={() => setChangeUsernameModalVisible(false)} 
                onSuccess={handleChangeUsernameSuccess}
            />
            <ChatModal 
                isOpen={chatModalVisible} 
                onClose={() => setChatModalVisible(false)} 
            />
        </header>
    );
};

export default Header;
