import React from 'react';
import LoginModal from '../modals/LoginModal';
import RegisterModal from '../modals/RegisterModal';
import ForgetPasswordModal from '../modals/ForgetPasswordModal';
import SearchForm from '../modals/SearchModal';
import VerificationModal from '../modals/VerificationModal';

const ModalController = ({ modalType, onClose, onUserLoggedIn, isOpen }) => {
    const renderModalContent = () => {
        switch (modalType) {
            case 'login':
                return <LoginModal isOpen={isOpen} onClose={onClose} onUserLoggedIn={onUserLoggedIn} />;
            case 'register':
                return <RegisterModal isOpen={isOpen} onClose={onClose} onVerificationOpen={onVerificationOpen}/>;
            case 'forget-password':
                return <ForgetPasswordModal isOpen={isOpen} onClose={onClose} />;
            case 'search':
                return <SearchForm isOpen={isOpen} onClose={onClose} />;
            case 'verify':
                return <VerificationModal isOpen={isOpen} onClose={onClose} />;
            default:
                return null;
        }
    };

    return isOpen ? (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                {renderModalContent()}
            </div>
        </div>
    ) : null;
};


export default ModalController;
