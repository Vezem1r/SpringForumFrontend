import React from 'react';
import { FaSlidersH } from 'react-icons/fa';

const SearchBar = ({ onOpen, onSearchInputChange, isLoggedIn, onOpenCreateTopicModal }) => {
    const handleChange = (e) => {
        onSearchInputChange(e.target.value);
    };

    return (
        <div className="flex items-center justify-between w-full max-w-lg mx-auto">
            <div className="flex items-center border border-gray-300 rounded-full shadow-md overflow-hidden bg-white flex-grow">
                <button 
                    onClick={onOpen} 
                    className="bg-gray-100 p-2 rounded-l-full hover:bg-gray-200 transition duration-200 ease-in-out"
                >
                    <FaSlidersH className="text-purple-600 h-5 w-5" />
                </button>
                <input
                    type="text"
                    placeholder="Search topics..."
                    className="p-2 flex-grow outline-none text-sm placeholder-gray-400"
                    onChange={handleChange}
                />
            </div>
            {isLoggedIn && (
                <button 
                    onClick={onOpenCreateTopicModal}
                    className="ml-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition duration-200 ease-in-out"
                >
                    Create Topic
                </button>
            )}
        </div>
    );
};

export default SearchBar;
