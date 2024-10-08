import React, { useState, useContext } from 'react';
import { FaUser, FaTag, FaCalendarAlt, FaPaperclip, FaFolder } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';

const TopicInfo = ({ topic, refreshTopic }) => {
    const [rating, setRating] = useState(topic.rating);
    const { isLoggedIn } = useContext(AuthContext);

    const handleVote = async (value) => {
        if (!isLoggedIn) {
            toast.error('You need to be logged in to change the rating!');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/ratings/topic/${topic.topicId}?value=${value}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                console.log('Vote updated successfully');
                await refreshTopic();
            } else {
                console.error('Failed to update vote');
            }
        } catch (error) {
            console.error('Error updating vote:', error);
        }
    };

    return (
        <div className="mt-4 p-6 bg-white shadow-md rounded-lg border border-gray-200 relative">
            <div className="flex justify-between items-start">
                <div className="flex-grow">
                    <h1 className="text-3xl font-bold text-purple-700">{topic.title}</h1>
                    <p className="text-gray-600 mt-2">{topic.content}</p>
                </div>

                <div className="flex flex-col items-center" style={{ width: '80px' }}>
                    <button
                        className="text-2xl text-purple-600 hover:text-purple-800"
                        onClick={() => handleVote(1)}
                    >
                        ▲
                    </button>

                    <span
                        className={`text-xl font-bold mx-2 ${topic.rating >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                        {topic.rating}
                    </span>

                    <button
                        className="text-2xl text-purple-600 hover:text-purple-800"
                        onClick={() => handleVote(-1)}
                    >
                        ▼
                    </button>
                </div>
            </div>

            {/* User and Date Information with Attachments */}
            <div className="flex justify-between items-center mt-4">
                <div className="flex flex-col text-gray-500">
                    <div className="flex items-center">
                        <FaUser className="mr-1" />
                        <span>
                            Created by <Link to={`/profile/${topic.username}`} className="font-semibold text-purple-500 hover:underline">{topic.username}</Link> on {new Date(topic.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <div className="flex items-center mt-2">
                        <FaCalendarAlt className="mr-1" />
                        <span>
                            Updated on {new Date(topic.updatedAt).toLocaleDateString()}
                        </span>
                    </div>

                    <div className="flex items-center mt-2">
                        <FaTag className="mr-1" />
                        <span>Category: <span className="font-semibold">{topic.category}</span></span>
                    </div>
                </div>

                {/* Attachments Section */}
                {topic.attachments.length > 0 && (
                    <div className="mt-4 ml-4">
                        <h2 className="text-xl font-bold flex items-center">
                            <FaPaperclip className="mr-2" />
                            Attachments
                        </h2>
                        <div className="flex flex-col mt-2">
                            {topic.attachments.map((attachment) => (
                                <div key={attachment.attachmentId} className="flex items-center mt-1">
                                    <FaFolder className="mr-2 text-gray-600" />
                                    <a
                                        href={`http://localhost:8080/topicpage/topics/${topic.topicId}/attachments/download/${attachment.attachmentId}`}
                                        className="text-purple-500 underline hover:text-purple-700"
                                    >
                                        {attachment.filename}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Tags Section */}
            <div className="mt-4">
                <h2 className="text-xl font-bold">Tags</h2>
                <div className="flex flex-wrap mt-2">
                    {topic.tagNames.map((tag, index) => (
                        <span key={index} className="inline-block bg-purple-200 text-purple-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopicInfo;
