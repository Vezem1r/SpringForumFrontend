import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authService from '../services/authService';

const ForgetPasswordModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);
    const [passwordError, setPasswordError] = useState(''); 

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumbers = /\d/.test(password);

        if (password.length < minLength) {
            return 'Password must be at least 8 characters long.';
        }
        if (!hasUpperCase) {
            return 'Password must contain at least one uppercase letter.';
        }
        if (!hasNumbers) {
            return 'Password must contain at least one number.';
        }
        return '';
    };

    const handleRequestReset = async (e) => {
        e.preventDefault();

        try {
            await authService.requestPasswordReset(email);
            toast.success('Password reset code has been sent to your email.');
            setStep(2);
        } catch (err) {
            toast.error('Failed to send reset code. Please try again.');
        }
    };

    const handleConfirmReset = async (e) => {
        e.preventDefault();

        const error = validatePassword(newPassword);
        if (error) {
            setPasswordError(error);
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }

        try {
            await authService.confirmPasswordReset(email, resetCode, newPassword);
            onClose(); 
        } catch (err) {
            toast.error('Failed to reset password. Please check your code and try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-purple-600">{step === 1 ? 'Forgot Password' : 'Confirm Reset'}</h2>
                    <button onClick={onClose} className="text-purple-600 text-xl">&times;</button>
                </div>
                {step === 1 ? (
                    <form onSubmit={handleRequestReset}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border border-gray-300 rounded p-2 mb-4 w-full"
                        />
                        <button type="submit" className="bg-purple-600 text-white rounded p-2 w-full hover:bg-purple-500 transition-colors duration-200">
                            Request Reset
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleConfirmReset}>
                        <input
                            type="text"
                            placeholder="Enter reset code"
                            value={resetCode}
                            onChange={(e) => setResetCode(e.target.value)}
                            required
                            className="border border-gray-300 rounded p-2 mb-4 w-full"
                        />
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                setPasswordError('');
                            }}
                            required
                            className="border border-gray-300 rounded p-2 mb-4 w-full"
                        />
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setPasswordError('');
                            }}
                            required
                            className="border border-gray-300 rounded p-2 mb-4 w-full"
                        />
                        {passwordError && <p className="text-red-500 mb-2">{passwordError}</p>}
                        <button type="submit" className="bg-purple-600 text-white rounded p-2 w-full hover:bg-purple-500 transition-colors duration-200">
                            Confirm Reset
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgetPasswordModal;
