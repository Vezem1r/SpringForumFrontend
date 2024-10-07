import React, { useState } from 'react';
import AuthService from '../services/authService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterModal = ({ isOpen, onClose, onVerificationOpen, onLoginClick }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

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

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (username.length < 5) {
            setError('Username must be at least 5 characters long.');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const user = await AuthService.register(username, email, password);
            
            if (user) {
                toast.success('Registration successful. Please check your email for verification code.');
                onVerificationOpen(email);
                setUsername('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (err) {
            if (err.message) {
                setError(err.message);
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };
    if (!isOpen) return null;

    return (
        <>
        <div 
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`} 
        >
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 transform transition-transform duration-300 scale-105 relative">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-purple-600">Registration</h2>
                    <button onClick={onClose} className="text-purple-600 text-xl">&times;</button>
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleRegister}>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder="Username"
                        className={`border rounded-md w-full p-2 mb-4 ${!username && error ? 'border-red-500' : ''}`} 
                        required 
                    />
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Email"
                        className={`border rounded-md w-full p-2 mb-4 ${!email && error ? 'border-red-500' : ''}`} 
                        required 
                    />
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Password" 
                        className={`border rounded-md w-full p-2 mb-4 ${!password && error ? 'border-red-500' : ''}`} 
                        required 
                    />
                    <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        placeholder="Confirm Password"
                        className={`border rounded-md w-full p-2 mb-4 ${!confirmPassword && error ? 'border-red-500' : ''}`} 
                        required 
                    />
                    <button 
                        type="submit" 
                        className="bg-purple-600 text-white rounded-md py-2 px-4 w-full"
                    >
                        Register
                    </button>
                </form>
                <div className="mt-4 text-center">
                    Already have an account? 
                    <button className="text-purple-600 font-semibold ml-2" onClick={onLoginClick}>Login</button>
                </div>
            </div>
        </div>
        </>
    );
};

export default RegisterModal;
