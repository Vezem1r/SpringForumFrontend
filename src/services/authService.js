import axios from 'axios';
import { comma } from 'postcss/lib/list';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:8080/auth';

const register = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, { username, email, password });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'An unexpected error occurred during registration.');
        } else {
            throw new Error('An unexpected error occurred during registration.');
        }
    }
};


const verifyCode = async (email, verificationCode) => {
    try {
        const response = await axios.post(`${API_URL}/verify`, { email, verificationCode });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            console.log(error.response.data.error);
            throw new Error(error.response.data.error);
        } else {
            throw new Error('An unexpected error occurred while sending verification code.');
        }
    }
};

const sendVerificationCode = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/resend?email=${email}`, { email });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            toast.error(error.response.data);
            throw new Error(error.response.data);
        } else {
            throw new Error('An unexpected error occurred while sending verification code.');
        }
    }
};

const login = async (usernameOrEmail, password) => {
    try {
        const response = await axios.post(`${API_URL}/signin`, { usernameOrEmail, password });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 400){
            throw new Error('Check your username or password.');
        }
        if (error.response && error.response.status === 404) {
            throw new Error(error.response.data);
        } else {
            throw new Error('An unexpected error occurred during login.');
        }

    }
};

const requestPasswordReset = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/password-reset/request?email=${email}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'An unexpected error occurred while requesting password reset.');
        } else {
            throw new Error('An unexpected error occurred while requesting password reset.');
        }
    }
};

const confirmPasswordReset = async (email, resetCode, newPassword) => {
    try {
        const response = await axios.post(`${API_URL}/password-reset/confirm`, {
            email,
            resetCode,
            newPassword,
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'An unexpected error occurred while confirming password reset.');
        } else {
            throw new Error('An unexpected error occurred while confirming password reset.');
        }
    }
};

export default {
    register,
    verifyCode,
    sendVerificationCode,
    login,
    requestPasswordReset,
    confirmPasswordReset,
};
