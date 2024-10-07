import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../context/AuthContext';

const ChangeUsernameModal = ({ isOpen, onClose, onSuccess }) => {
    const [newUsername, setNewUsername] = useState('');
    const [error, setError] = useState('');
    const { validateUsername } = useContext(AuthContext);

    const handleChangeUsername = async () => {
        if (!newUsername) {
            setError("Username cannot be empty.");
            toast.error("Username cannot be empty.");
            return;
        }
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(
                'http://localhost:8080/users/change-username',
                { newUsername },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/json', 
                    }
                }
            );
            onSuccess(response.data);
            validateUsername(response.data.token);
            toast.success("Username successfully changed.");
            onClose();
        } catch (err) {
            if (err.response && err.response.data) {
                const message = err.response.data.message || "Username is already taken.";
                toast.error(message); 
            } else {
                const message = "An error occurred. Please try again.";
                toast.error(message);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <Modal isOpen={isOpen} onRequestClose={onClose} className="fixed inset-0 flex items-center justify-center z-50" overlayClassName="fixed inset-0 bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-purple-600">Change Username</h2>
                        <button onClick={onClose} className="text-purple-600 text-xl">&times;</button>
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="New Username"
                        className="border border-gray-300 rounded p-2 mb-4 w-full"
                    />
                    <button onClick={handleChangeUsername} className="bg-purple-600 text-white rounded p-2 w-full hover:bg-purple-500 transition-colors duration-200">
                        Change
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default ChangeUsernameModal;
