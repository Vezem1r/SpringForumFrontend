import React, { useEffect, useState } from 'react';
import apiClient from '../../axiosInstance';

const CategoryManagement = ({ onClose }) => {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await apiClient.get('/admin/category/getAllCategories', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCategories(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchCategories();
    }, []);

    const handleCreateCategory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await apiClient.post('/admin/category/create', {
                name: categoryName,
                description: categoryDescription,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCategories([...categories, response.data]);
            setCategoryName('');
            setCategoryDescription('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateCategory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await apiClient.put(`/admin/category/update/${editingCategoryId}`, {
                name: categoryName,
                description: categoryDescription,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCategories(categories.map(cat => (cat.categoryId === editingCategoryId ? response.data : cat)));
            setEditingCategoryId(null);
            setCategoryName('');
            setCategoryDescription('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await apiClient.delete(`/admin/category/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCategories(categories.filter(cat => cat.categoryId !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditClick = (category) => {
        if (editingCategoryId === category.categoryId) {
            setEditingCategoryId(null);
            setCategoryName('');
            setCategoryDescription('');
        } else {
            setEditingCategoryId(category.categoryId);
            setCategoryName(category.name);
            setCategoryDescription(category.description);
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-purple-600">Manage Categories</h2>
                    <button onClick={onClose} className="text-purple-600 text-xl">&times;</button>
                </div>
                {error && <div className="text-red-500 mb-2">{error}</div>}

                <div className="mb-4">
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="Enter category name"
                        className="border rounded p-2 w-full"
                    />
                    <input
                        type="text"
                        value={categoryDescription}
                        onChange={(e) => setCategoryDescription(e.target.value)}
                        placeholder="Enter category description"
                        className="border rounded p-2 w-full mt-2"
                    />
                    <button
                        onClick={editingCategoryId ? handleUpdateCategory : handleCreateCategory}
                        className="bg-purple-600 text-white px-4 py-2 rounded mt-2 w-full"
                    >
                        {editingCategoryId ? 'Update Category' : 'Create Category'}
                    </button>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search categories..."
                        className="border rounded p-2 w-full mb-2"
                    />
                </div>

                <ul className="max-h-60 overflow-y-auto mb-4">
                    {filteredCategories.map(category => (
                        <li key={category.categoryId} className="flex justify-between items-center mb-2">
                            <div>
                                <span className="block font-bold">{category.name}</span>
                                <span className="text-sm text-gray-500">{category.description}</span>
                            </div>
                            <div>
                                <button
                                    onClick={() => handleEditClick(category)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                                >
                                    {editingCategoryId === category.categoryId ? 'Cancel' : 'Edit'}
                                </button>
                                <button
                                    onClick={() => handleDeleteCategory(category.categoryId)}
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

export default CategoryManagement;
