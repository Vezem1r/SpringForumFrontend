import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TopicList from '../components/TopicList';
import TopicCard from '../components/TopicCard';
import { FaEnvelope, FaComments, FaList, FaStar, FaCalendarAlt } from 'react-icons/fa';
import Header from '../components/Header';

const UserProfile = () => {
    const { username } = useParams();
    const [profileData, setProfileData] = useState({});
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetchProfile = async (pageNum = 0) => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : undefined,
                    },
                };
                const response = await axios.get(`http://localhost:8080/profilepage/${username}?page=${pageNum}`, config);
                const data = response.data;
        
                if (pageNum === 0) {
                    setProfileData(data.profile);
                    setTopics(data.profile.topics || []);
                } else {
                    setTopics(prevTopics => [...prevTopics, ...(data.profile.topics || [])]);
                }
        
                setTotalPages(data.totalPages);
                setHasMore(pageNum < data.totalPages - 1);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        };
        

        fetchProfile(page);
    }, [username, page]);

    const handleScroll = useCallback(() => {
        const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
        if (bottom && hasMore && !loading) {
            setPage(prevPage => prevPage + 1);
        }
    }, [hasMore, loading]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    if (loading && page === 0) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div>
            <Header />
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-4">
                <div className="flex items-center mb-6">
                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-md border-4 border-purple-600 mr-6">
                        {profileData?.profilePicture ? (
                            <img 
                                src={`http://localhost:8080/avatars/${profileData.profilePicture}`}
                                alt={`${profileData.username}'s Profile`}
                                className="w-full h-full object-cover rounded-md" 
                            />
                        ) : (
                            <img 
                                src="https://api.dicebear.com/9.x/pixel-art-neutral/svg"
                                alt="Default Avatar"
                                className="w-full h-full object-cover rounded-md" 
                            />
                        )}
                    </div>
                    <div className="flex-grow">
                        <h1 className="text-3xl font-bold text-gray-800">{profileData?.username}</h1>
                    </div>
                    <div className="flex flex-row items-end">
                        <p className="font-semibold text-purple-700">Rating: {profileData?.rating}</p>
                        <FaStar className="text-yellow-500 text-2xl" />
                    </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-gray-600">
                        <p className="flex items-center"><FaEnvelope className="mr-2"/>Email: {profileData?.email || 'Private'}</p>
                        <p className="flex items-center"><FaComments className="mr-2"/>Comments: {profileData?.commentCount}</p>
                        <p className="flex items-center"><FaList className="mr-2"/>Topics: {profileData?.topicCount}</p>
                        <p className="flex items-center"><FaCalendarAlt className="mr-2"/>Joined: {new Date(profileData?.createdAt).toLocaleDateString()}</p>
                        <p className="flex items-center"><FaCalendarAlt className="mr-2"/>Last Login: {new Date(profileData?.lastLogin).toLocaleDateString()}</p>
                    </div>
                </div>

                <h2 className="text-2xl font-semibold mt-6 mb-2 border-b pb-2 border-gray-300">User Topics</h2>
                {topics.length > 0 ? (
                    <TopicList>
                        {topics.map((topic) => (
                            <TopicCard key={topic.topicId} topic={topic} />
                        ))}
                    </TopicList>
                ) : (
                    <p className="mt-2 text-gray-600">No topics found.</p>
                )}

                {loading && page > 0 && (
                    <div className="text-center mt-4">Loading more topics...</div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
