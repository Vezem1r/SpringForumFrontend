import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import apiClient from '../axiosInstance';
import { FaSearch, FaTag, FaStar, FaLayerGroup, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import '../styles/SearchModal.css';

const SearchModal = ({ isOpen, onClose, onSearch }) => {
    const initialSearchParams = {
        title: '',
        tags: '',
        minRating: '',
        maxRating: '',
        category: '',
        sortBy: 'createdAt',
        sortOrder: 'asc',
    };

    const [searchParams, setSearchParams] = useState(initialSearchParams);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (isOpen) {
            apiClient.get('/homepage/getAllCategories')
                .then((response) => {
                    setCategories(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching categories:', error);
                });
        }
    }, [isOpen]);

    const handleSearch = () => {
        const tagsArray = searchParams.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag !== '');

        const paramsToSend = {
            title: searchParams.title || undefined,
            category: searchParams.category || undefined,
            tags: tagsArray.length > 0 ? tagsArray.join(',') : undefined,
            minRating: searchParams.minRating ? Number(searchParams.minRating) : undefined,
            maxRating: searchParams.maxRating ? Number(searchParams.maxRating) : undefined,
            sortOrder: `${searchParams.sortBy},${searchParams.sortOrder}`,
        };

        console.log('Params to send:', paramsToSend);

        apiClient.get('/homepage/search', { params: paramsToSend })
            .then(response => {
                onSearch(response.data);
                onClose();
            })
            .catch(error => {
                console.error('Error searching topics:', error);
            });
    };

    const handleReset = () => {
        setSearchParams(initialSearchParams);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="modal-container mx-auto my-10 max-w-screen-md rounded-xl border border-gray-200 bg-white p-6 shadow-lg"
            overlayClassName="fixed inset-0 bg-black bg-opacity-70 transition-opacity duration-300"
            ariaHideApp={false}
        >
            <div>
                <h2 className="text-purple-600 text-xl font-bold">Apply Filters</h2>
                <p className="mt-1 text-sm">Use filters to further refine your search</p>
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <div className="flex flex-col">
                        <label className="text-stone-600 text-sm font-medium">Title:</label>
                        <div className="flex items-center mt-2">
                            <FaSearch className="text-gray-400 mr-2" />
                            <input
                                type="text"
                                value={searchParams.title}
                                onChange={(e) => setSearchParams({ ...searchParams, title: e.target.value })}
                                className="block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                placeholder="Enter title"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-stone-600 text-sm font-medium">Tags:</label>
                        <div className="flex items-center mt-2">
                            <FaTag className="text-gray-400 mr-2" />
                            <input
                                type="text"
                                value={searchParams.tags}
                                onChange={(e) => setSearchParams({ ...searchParams, tags: e.target.value })}
                                className="block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                placeholder="Enter tags separated by commas"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-stone-600 text-sm font-medium">Min Rating:</label>
                        <div className="flex items-center mt-2">
                            <FaStar className="text-gray-400 mr-2" />
                            <input
                                type="number"
                                value={searchParams.minRating}
                                onChange={(e) => setSearchParams({ ...searchParams, minRating: e.target.value })}
                                className="block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-stone-600 text-sm font-medium">Max Rating:</label>
                        <div className="flex items-center mt-2">
                            <FaStar className="text-gray-400 mr-2" />
                            <input
                                type="number"
                                value={searchParams.maxRating}
                                onChange={(e) => setSearchParams({ ...searchParams, maxRating: e.target.value })}
                                className="block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-stone-600 text-sm font-medium">Category:</label>
                        <select
                            value={searchParams.category}
                            onChange={(e) => setSearchParams({ ...searchParams, category: e.target.value })}
                            className="mt-2 block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.categoryId} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-stone-600 text-sm font-medium">Sort By:</label>
                        <div className="flex items-center mt-2">
                            <FaLayerGroup className="text-gray-400 mr-2" />
                            <select
                                value={searchParams.sortBy}
                                onChange={(e) => setSearchParams({ ...searchParams, sortBy: e.target.value })}
                                className="block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            >
                                <option value="createdAt">Creation Date</option>
                                <option value="updatedAt">Update Date</option>
                                <option value="rating">Rating</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-stone-600 text-sm font-medium">Order:</label>
                        <div className="flex items-center mt-2">
                            <FaCalendarAlt className="text-gray-400 mr-2" />
                            <select
                                value={searchParams.sortOrder}
                                onChange={(e) => setSearchParams({ ...searchParams, sortOrder: e.target.value })}
                                className="block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="active:scale-95 rounded-lg bg-gray-200 px-8 py-2 font-medium text-gray-600 outline-none focus:ring hover:opacity-90"
                    >
                        Reset
                    </button>
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="active:scale-95 rounded-lg bg-purple-600 px-8 py-2 font-medium text-white outline-none focus:ring hover:opacity-90"
                    >
                        Search
                    </button>
                </div>
            </div>
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
                <FaTimes />
            </button>
        </Modal>
    );
};

export default SearchModal;
