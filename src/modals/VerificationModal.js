import React, { useState } from 'react';
import AuthService from '../services/authService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerificationModal = ({ isOpen, onClose, email, onEmailVerified }) => {
    const [verificationCode, setVerificationCode] = useState('');

    const handleVerification = async (e) => {
        e.preventDefault();
        try {
            const response = await AuthService.verifyCode(email, verificationCode);

            if (response) {
                onEmailVerified(email);
                toast.success('Verification successful!');
            }
        } catch (error) {
            toast.error(error.message || 'Verification failed.');
        }
    };
    

    const handleResendCode = async () => {
        try {
            await AuthService.sendVerificationCode(email);
            toast.success('Verification code resent!');
        } catch (err) {
        }
    };

    return (
        <>
            <div className={`fixed inset-0 z-40 ${isOpen ? 'flex' : 'hidden'} items-center justify-center bg-black bg-opacity-50`}>
                <div className="bg-white rounded-lg shadow-lg p-6 w-96 transform transition-transform duration-300 scale-105 relative">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-purple-600">Verify Your Email</h2>
                        <button onClick={onClose} className="text-purple-600 text-xl">&times;</button>
                    </div>
                    <form onSubmit={handleVerification}>
                        <div className="mb-4">
                            <input 
                                type="text" 
                                placeholder="Verification Code"
                                value={verificationCode} 
                                onChange={(e) => setVerificationCode(e.target.value)} 
                                className="border rounded-md w-full p-2" 
                                required 
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="bg-purple-600 text-white rounded-md py-2 px-4 w-full hover:bg-purple-700 transition duration-300"
                        >
                            Verify
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <button 
                            className="text-purple-600 hover:underline" 
                            onClick={handleResendCode}
                        >
                            Resend Code
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerificationModal;
