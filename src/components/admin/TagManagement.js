import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TagManagement = ({ onClose }) => {
    const [tags, setTags] = useState([]);
    const [tagName, setTagName] = useState('');
    const [editingTagId, setEditingTagId] = useState(null);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/admin/tag/getAllTags', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTags(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchTags();
    }, []);

    const handleCreateTag = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8080/admin/tag/create', { name: tagName }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTags([...tags, response.data]);
            setTagName('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateTag = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:8080/admin/tag/update/${editingTagId}`, { name: tagName }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTags(tags.map(tag => (tag.tagId === editingTagId ? response.data : tag)));
            setEditingTagId(null);
            setTagName('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteTag = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/admin/tag/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTags(tags.filter(tag => tag.tagId !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditClick = (tag) => {
        if (editingTagId === tag.tagId) {
            setEditingTagId(null);
            setTagName('');
        } else {
            setEditingTagId(tag.tagId);
            setTagName(tag.name);
        }
    };

    const filteredTags = tags.filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-purple-600">Manage Tags</h2>
                    <button onClick={onClose} className="text-purple-600 text-xl">&times;</button>
                </div>
                {error && <div className="text-red-500 mb-2">{error}</div>}

                <div className="mb-4">
                    <input
                        type="text"
                        value={tagName}
                        onChange={(e) => setTagName(e.target.value)}
                        placeholder="Enter tag name"
                        className="border rounded p-2 w-full"
                    />
                    <button
                        onClick={editingTagId ? handleUpdateTag : handleCreateTag}
                        className="bg-purple-600 text-white px-4 py-2 rounded mt-2 w-full"
                    >
                        {editingTagId ? 'Update Tag' : 'Create Tag'}
                    </button>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search tags..."
                        className="border rounded p-2 w-full mb-2"
                    />
                </div>

                <ul className="max-h-60 overflow-y-auto mb-4">
                    {filteredTags.map(tag => (
                        <li key={tag.tagId} className="flex justify-between items-center mb-2">
                            <span>{tag.name}</span>
                            <div>
                                <button
                                    onClick={() => handleEditClick(tag)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                                >
                                    {editingTagId === tag.tagId ? 'Cancel' : 'Edit'}
                                </button>
                                <button
                                    onClick={() => handleDeleteTag(tag.tagId)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TagManagement;
