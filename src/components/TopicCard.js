import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faClock, faTags, faCalendarAlt, faFolderOpen, faStar } from '@fortawesome/free-solid-svg-icons';

const TopicCard = ({ topic }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/topic/${topic.topicId}`);
    };

    const getRatingColor = (rating) => {
        return rating >= 0 ? 'text-green-500' : 'text-red-500';
    };

    return (
        <div
            className="p-4 border-b border-gray-200 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow cursor-pointer"
            onClick={handleCardClick}
        >
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-purple-700">{topic.title}</h2>
            </div>
            <p className="text-gray-600 mt-2">{topic.content}</p>

            <div className="flex justify-between items-center mt-4">
                <p className="text-gray-500 text-sm">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-purple-500" />
                    Created: {new Date(topic.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-500 text-sm">
                    <FontAwesomeIcon icon={faClock} className="mr-1 text-purple-500" />
                    Updated: {new Date(topic.updatedAt).toLocaleDateString()}
                </p>
            </div>
            <div className="flex justify-between items-center mt-2">
                <p className={`text-sm ${getRatingColor(topic.rating)}`}>
                    <FontAwesomeIcon icon={faStar} className="mr-1" />
                    Rating: {topic.rating}
                </p>
                <p className="text-gray-500 text-sm">
                    <FontAwesomeIcon icon={faUser} className="mr-1 text-purple-500" />
                    {topic.username}
                </p>
                <p className="text-gray-500 text-sm">
                    <FontAwesomeIcon icon={faFolderOpen} className="mr-1 text-purple-500" />
                    {topic.category}
                </p>
            </div>

            <div className="mt-4 border-t pt-2">
                <div className="flex items-center overflow-hidden whitespace-nowrap">
                    <FontAwesomeIcon icon={faTags} className="text-purple-500 mr-2" />
                    <div className="flex flex-wrap max-w-full overflow-hidden text-ellipsis">
                        {topic.tagNames.map((tag, index) => (
                            <span key={index} className="inline-block bg-purple-200 text-purple-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full truncate">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <span className="ml-2 text-gray-500 text-xs">...</span>
                </div>
            </div>
        </div>
    );
};

export default TopicCard;
