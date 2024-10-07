import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateTopicModal = ({ isOpen, onClose, onTopicCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [tags, setTags] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [banner, setBanner] = useState(null);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/homepage/getAllCategories');
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                setError('Failed to load categories.');
            }
        };

        fetchCategories();
    }, []);

    const handleTopicCreate = async () => {
        if (!title || !content || !categoryId || !tags) {
            setError('All fields except attachments are required.');
            return;
        }

        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('categoryId', categoryId);

        const lowercaseTags = tags.split(',').map(tag => tag.trim().toLowerCase());
        formData.append('tagNames',lowercaseTags);
        attachments.forEach(file => {
            formData.append('attachments', file);
        });

        if (banner) {
            formData.append('banner', banner);
        }

        try {
            const response = await axios.post('http://localhost:8080/topics/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Response:', response.data);

            onTopicCreated(response.data);
            onClose();
        } catch (error) {
            console.error('Failed to create topic:', error);
            setError('Topic creation failed.');
        }
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAttachmentChange = (e) => {
        setAttachments(Array.from(e.target.files));
    };

    const handleBannerChange = (e) => {
        setBanner(e.target.files[0]);
    };

    if (!isOpen) return null;

    return (
        <div className="modal fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Create New Topic</h2>
                    <button onClick={onClose} className="text-gray-600 text-xl">&times;</button>
                </div>

                <label className="block mb-2">Title</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="w-full p-2 border rounded mb-4"
                />

                <label className="block mb-2">Content</label>
                <textarea 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    className="w-full p-2 border rounded mb-4"
                />

                <label className="block mb-2">Category</label>
                <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder="Search categories"
                    className="w-full p-2 border rounded mb-2"
                />
                <select
                    value={categoryId} 
                    onChange={(e) => setCategoryId(e.target.value)} 
                    className="w-full p-2 border rounded mb-4"
                >
                    <option value="">Select a category</option>
                    {filteredCategories.map(category => (
                        <option key={category.categoryId} value={category.categoryId}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <label className="block mb-2">Tags (comma separated)</label>
                <input 
                    type="text" 
                    value={tags} 
                    onChange={(e) => setTags(e.target.value)} 
                    className="w-full p-2 border rounded mb-4"
                />

                <label className="block mb-2">Attach files</label>
                <input 
                    type="file" 
                    onChange={handleAttachmentChange} 
                    multiple 
                    className="mb-4"
                />

                <label className="block mb-2">Upload Banner</label>
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleBannerChange} 
                    className="mb-4"
                />
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <button 
                    onClick={handleTopicCreate} 
                    className="bg-purple-600 text-white p-2 w-full rounded hover:bg-purple-500 transition-colors duration-200"
                >
                    Create Topic
                </button>
            </div>
        </div>
    );
};

export default CreateTopicModal;
