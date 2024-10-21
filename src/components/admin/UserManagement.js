import React, { useState, useEffect } from 'react';
import apiClient from '../../axiosInstance';

const UserManagement = ({ onClose }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await apiClient.get('/admin/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (err) {
                setError('Error fetching users');
            }
        };
        fetchUsers();
    }, []);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setUsername(user.username);
    };

    const handleAvatarChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('username', username);
            if (avatar) formData.append('avatar', avatar);

            const token = localStorage.getItem('token');
            const response = await apiClient.put(
                `/admin/users/${selectedUser.userId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.userId === selectedUser.userId ? response.data : user
                )
            );

            setSelectedUser(null);
            setAvatar(null);
            setUsername('');
        } catch (err) {
            setError('Error updating user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/2 max-h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-purple-600">Manage Users</h2>
                    <button onClick={onClose} className="text-purple-600 text-xl">&times;</button>
                </div>
                {error && <div className="text-red-500">{error}</div>}
                <div className="mb-6">
                    <ul className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 p-2 rounded-md">
                        {users.map((user) => (
                            <li
                                key={user.userId}
                                className="cursor-pointer p-2 border border-gray-300 rounded-md hover:bg-gray-100"
                                onClick={() => handleSelectUser(user)}
                            >
                                {user.username} ({user.email})
                            </li>
                        ))}
                    </ul>
                </div>
                {selectedUser && (
                    <form onSubmit={handleUpdateUser}>
                        <h3 className="text-xl font-semibold mb-2">
                            Edit User: {selectedUser.username}
                        </h3>
                        <div className="mb-4">
                            <label className="block mb-1 font-semibold">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 font-semibold">Avatar</label>
                            <input
                                type="file"
                                onChange={handleAvatarChange}
                                className="p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={() => setSelectedUser(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-purple-600 text-white px-4 py-2 rounded-md"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update User'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
