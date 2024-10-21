import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../axiosInstance';
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
    const [pageNum, setPageNum] = useState(0);
    const [hasMoreComments, setHasMoreComments] = useState(true);

    const BASE_URL = "http://localhost:8080/banners/";

    const fetchTopic = useCallback(async () => {
        try {
            const response = await apiClient.get(`/topicpage/${id}?page=${pageNum}`);
            const updatedTopic = {
                ...response.data,
                bannerUrl: response.data.bannerUrl ? BASE_URL + response.data.bannerUrl.split('\\').pop() : null
            };
            setTopic(prevTopic => {
                if (pageNum === 0) {
                    return updatedTopic;
                }
                return {
                    ...prevTopic,
                    comments: [...prevTopic.comments, ...response.data.comments],
                };
            });
            setHasMoreComments(response.data.comments.length > 0);
        } catch (err) {
            setError('Failed to load topic data');
            console.error("Error fetching topic data:", err);
        } finally {
            setLoading(false);
        }
    }, [id, pageNum]);
    
    useEffect(() => {
        fetchTopic();
    }, [fetchTopic]);
    

    const handleCommentAdded = (newComment) => {
        setTopic(prevTopic => ({
            ...prevTopic,
            comments: [...prevTopic.comments, newComment],
        }));
    };

    const handleReplyAdded = (parentId, newReply) => {
        setTopic(prevTopic => {
            const updatedComments = prevTopic.comments.map(comment => {
                if (comment.commentId === parentId) {
                    const oldReplies = comment.replies ? comment.replies : []; 
                    return {
                        ...comment,
                        replies: [...oldReplies, newReply],
                        replyCount: comment.replyCount + 1
                    };
                }
                return comment;
            });
            return { ...prevTopic, comments: updatedComments };
        });
    };

    const handleLoadMoreComments = () => {
        if (hasMoreComments) {
            setPageNum(prevPage => prevPage + 1);
        }
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
                <CommentList 
                    comments={topic.comments} 
                    topicId={topic.topicId} 
                    handleReplyAdded={handleReplyAdded} 
                    onReplyClick={handleReplyClick}
                    refreshTopic={fetchTopic}
                />
                {hasMoreComments && (
                    <button 
                        onClick={handleLoadMoreComments}
                        className="mt-4 text-purple-500 hover:underline"
                    >
                        Load More Comments
                    </button>
                )}
            </div>
        </div>
    );
};

export default TopicPage;
