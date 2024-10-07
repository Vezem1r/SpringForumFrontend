import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import {toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginModal = ({ isOpen, onClose, onLogin, onRegisterClick, onForgotPasswordClick, prefilledEmail }) => {
    const [usernameOrEmail, setUsernameOrEmail] = useState(prefilledEmail || '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setUsernameOrEmail(prefilledEmail || '');
    }, [prefilledEmail]);

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const data = await authService.login(usernameOrEmail, password);
            localStorage.setItem('token', data.token);
            onLogin(data.token);
            onClose();
            window.location.href = '/';
        } catch (err) {
            toast.error(err.message || 'Login failed.');
        }
    };

    if (!isOpen) return null;

    return (
        <>
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50`}>
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-purple-600">LogIn</h2>
                        <button onClick={onClose} className="text-purple-600 text-xl">&times;</button>
                    </div>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username or Email"
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                        required
                        className="border border-gray-300 rounded p-2 mb-4 w-full"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border border-gray-300 rounded p-2 mb-4 w-full"
                    />
                    <button type="submit" className="bg-purple-600 text-white rounded p-2 w-full hover:bg-purple-500 transition-colors duration-200">
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <button onClick={onForgotPasswordClick} className="text-purple-600">Forgot Password?</button>
                </div>
                <p className="mt-4 text-center">
                    Don't have an account?  
                    <button onClick={onRegisterClick} className="text-purple-600 font-semibold ml-2"> Register</button>
                </p>
            </div>
        </div>
        </>
    );
};

export default LoginModal;

