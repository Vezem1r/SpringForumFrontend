import React, { useState } from 'react';
import apiClient from '../../axiosInstance';

const CommentForm = ({ topicId, onCommentAdded }) => {
    const [content, setContent] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [error, setError] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!content.trim()) {
            setError('Comment cannot be empty');
            return;
        }        

        const formData = new FormData();
        formData.append('content', content);
        formData.append('topicId', topicId);

        attachments.forEach((file) => {
            formData.append('attachments', file);
        });

        try {
            const response = await apiClient.post('/comments/add', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.ok) {
                const newComment = await response.json();
                onCommentAdded(newComment);
                setContent('');
                setAttachments([]);
            } else {
                console.error('Failed to add comment');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4 mt-4 bg-white shadow-md rounded-lg p-4 border border-gray-300">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Add a Comment</h2>
            {error && <p className="text-red-600">{error}</p>}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your comment..."
                className="border border-gray-300 rounded-md w-full p-3 mb-2 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                rows="4"
            />
            <input
                type="file"
                multiple
                onChange={(e) => setAttachments([...attachments, ...Array.from(e.target.files)])}
                className="mb-2 w-full text-sm text-gray-500 border border-gray-300 rounded-md p-2 hover:bg-gray-50 transition"
            />
            <button 
                type="submit" 
                className="bg-purple-600 text-white rounded-md px-4 py-2 hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
                Submit Comment
            </button>
        </form>
    );
};

export default CommentForm;
