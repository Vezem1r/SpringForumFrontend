import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Banner from '../components/topic/banner';
import TopicInfo from '../components/topic/TopicInfo';
import CommentList from '../components/topic/CommentList';
import CommentForm from '../components/topic/CommentForm'; 
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TopicPage = () => {
    const { id } = useParams();
    const { isLoggedIn } = useContext(AuthContext);
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const BASE_URL = "http://localhost:8080/banners/";

    const fetchTopic = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/topicpage/${id}`);
            const updatedTopic = {
                ...response.data,
                bannerUrl: response.data.bannerUrl ? BASE_URL + response.data.bannerUrl.split('\\').pop() : null
            };
            setTopic(updatedTopic);
        } catch (err) {
            setError('Failed to load topic data');
            console.error("Error fetching topic data:", err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchTopic();
    }, [id]);

    const handleCommentAdded = (newComment) => {
        setTopic((prevTopic) => ({
            ...prevTopic,
            comments: [...prevTopic.comments, newComment],
        }));
    };

    const handleReplyAdded = (parentId, newReply) => {
        setTopic((prevTopic) => {
            const updatedComments = prevTopic.comments.map(comment => {
                if (comment.commentId === parentId) {
                    return {
                        ...comment,
                        replies: [...comment.replies, newReply],
                        replyCount: comment.replyCount + 1
                    };
                }
                return comment;
            });

            return { ...prevTopic, comments: updatedComments };
        });
    };

    const handleReplyClick = () => {
        if (!isLoggedIn) {
            toast.info("You need to be logged in to leave comments.");
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><span>Loading...</span></div>;
    if (error) return <div className="text-center text-red-600">{error}</div>;

    return (
        <div>
            <Header onSearch={(query) => console.log(query)} />
            <div className="p-4">
                <Banner bannerUrl={topic.bannerUrl} />
                <TopicInfo topic={topic} topicId={topic.topicId} refreshTopic={fetchTopic} />
                {isLoggedIn ? (
                    <CommentForm topicId={topic.topicId} onCommentAdded={handleCommentAdded} /> 
                ) : null}
                <CommentList comments={topic.comments} topicId={topic.topicId} handleReplyAdded={handleReplyAdded} onReplyClick={handleReplyClick} 
                refreshTopic={fetchTopic}
                />
            </div>
        </div>
    );
};

export default TopicPage;
