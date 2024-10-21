import React, { useState } from 'react';
import apiClient from '../../axiosInstance';

const EditTopicModal = ({ topic, onClose, refreshTopic }) => {
    const [title, setTitle] = useState(topic.title);
    const [content, setContent] = useState(topic.content);
    const [banner, setBanner] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleBannerChange = (e) => {
        setBanner(e.target.files[0]);
    };

    const handleUpdateTopic = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (banner) formData.append('banner', banner);

        try {
            const response = await apiClient.put(`/admin/topics/${topic.topicId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                await refreshTopic();
                onClose();
            }
        } catch (error) {
            console.error('Error updating topic:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-purple-600">Edit Topic</h2>
                    <button onClick={onClose} className="text-purple-600 text-xl">&times;</button>
                </div>
                <form onSubmit={handleUpdateTopic}>
                    <div>
                        <label className="block text-gray-700">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="border border-gray-300 rounded w-full p-2"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-gray-700">Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            className="border border-gray-300 rounded w-full p-2"
                        />
                    </div>
                    <div className="mt-2">
                        <label className="block text-gray-700">Banner</label>
                        <input
                            type="file"
                            onChange={handleBannerChange}
                            className="border border-gray-300 rounded w-full p-2"
                        />
                    </div>
                    <div className="flex justify-end mt-4">
                        <button type="submit" className="bg-purple-600 text-white px-4 py-2 w-full rounded">
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTopicModal;
