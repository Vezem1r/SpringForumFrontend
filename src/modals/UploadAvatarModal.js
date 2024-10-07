import React, { useState, useContext } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Ensure you have this context for token access
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UploadAvatarModal = ({ isOpen, onClose, onSuccess }) => {
    const { token } = useContext(AuthContext); // Access the token from context
    const [avatar, setAvatar] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!avatar) {
            setError("Please select an avatar.");
            return;
        }
    
        const formData = new FormData();
        formData.append('avatar', avatar);
    
        try {
            const token = localStorage.getItem('token'); // Retrieve the token
            const response = await axios.post('http://localhost:8080/users/upload-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`, // Include the JWT token
                },
            });
            onSuccess(response.data);
            onClose();
            toast.success("Avatar uploaded successfully!");
        } catch (err) {
            setError("Failed to upload avatar.");
            console.error(err); // Log the error for debugging
        }
    };
    

    return (
        <>
            <Modal 
                isOpen={isOpen} 
                onRequestClose={onClose} 
                className="bg-white rounded-lg shadow-lg p-6 w-96"
                overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-purple-600">Upload Avatar</h2>
                    <button onClick={onClose} className="text-purple-600 text-xl">&times;</button>
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                <div className="flex justify-between">
                    <button 
                        onClick={handleUpload} 
                        className="bg-purple-600 text-white rounded p-2 w-full hover:bg-purple-500 transition-colors duration-200 mr-2"
                    >
                        Upload
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default UploadAvatarModal;
