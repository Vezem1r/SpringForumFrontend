import React, { useState, useEffect, useContext } from 'react';
import ReplyList from './ReplyList'; 
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../../axiosInstance';

const Comment = ({ comment, topicId, handleReplyAdded, refreshTopic }) => {
    const [showReplies, setShowReplies] = useState(false);
    const { isLoggedIn, isAdmin } = useContext(AuthContext);
    const [replies, setReplies] = useState([]);
    const [replyContent, setReplyContent] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [replyAttachments, setReplyAttachments] = useState([]);
    const [isReplying, setIsReplying] = useState(false);
    const [showAttachments, setShowAttachments] = useState(false);
    const [currentComment, setComment] = useState(comment);
    const [pageNum, setPageNum] = useState(0);
    const [hasMoreReplies, setHasMoreReplies] = useState(true);
    const [totalReplies, setTotalReplies] = useState(0);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const fetchReplies = async (page) => {
            try {
                const response = await fetch(`${apiClient.defaults.baseURL}/topicpage/${comment.commentId}/replies?page=${page}`);
                const data = await response.json();
                setReplies(data.content);
                setTotalReplies(data.totalElements);
                setHasMoreReplies(data.content.length > 0);
            } catch (error) {
                console.error('Error fetching replies:', error);
            }
        };

        if (showReplies) {
            fetchReplies(pageNum);
        }

        if (comment.attachments) {
            setAttachments(comment.attachments);
        }
    }, [showReplies, comment.commentId, comment.attachments, pageNum]);

    const fetchUpdatedRating = async () => {
        try {
            const response = await fetch(`${apiClient.defaults.baseURL}/topicpage/comments/${currentComment.commentId}/rating`);
            if (response.ok) {
                const newRating = await response.json();
                setComment((prevComment) => ({ ...prevComment, rating: newRating }));
            } else {
                console.error('Failed to fetch updated rating');
            }
        } catch (error) {
            console.error('Error fetching updated rating:', error);
        }
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('content', replyContent);
        formData.append('topicId', topicId);
        formData.append('parentId', comment.commentId);


        replyAttachments.forEach((file) => {
            formData.append('attachments', file);
        });

        try {
            const response = await apiClient.post('/comments/add', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.ok) {
                const newReply = await response.json();
                handleReplyAdded(comment.commentId, newReply);
                setReplyContent('');
                setReplyAttachments([]);
                setIsReplying(false);
            } else {
                console.error('Failed to add reply');
            }
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    const handleVote = async (value) => {
        if (!isLoggedIn) {
            toast.error('You need to be logged in to change the rating!');
            return;
        }

        try {
            const response = await fetch(`${apiClient.defaults.baseURL}/ratings/comment/${currentComment.commentId}?value=${value}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                await fetchUpdatedRating();
                refreshTopic();
            } else {
                console.error('Failed to update vote');
            }
        } catch (error) {
            console.error('Error updating vote:', error);
        }
    };

    const handleReplyToggle = () => {
        if (isLoggedIn) {
            setIsReplying(!isReplying);
        } else {
            toast.error('You need to be logged in to reply!');
        }
    };

    const loadMoreReplies = () => {
        if (hasMoreReplies) {
            setPageNum((prevPage) => prevPage + 1);
        }
    };

    const handleDeleteComment = async () => {
        try {
            const response = await fetch(`${apiClient.defaults.baseURL}/admin/comments/${currentComment.commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                toast.success('Comment deleted successfully!');
            } else {
                console.error('Failed to delete comment');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        } finally {
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className="p-4 mb-4 rounded-md bg-white hover:shadow-lg transition-shadow duration-200 relative">
            <div className="absolute left-0 top-0 h-full border-l-2 border-purple-600"></div>
            <div className="absolute left-2 top-4 w-4 h-4 bg-white rounded-full"></div>
            <div className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                    <button 
                        className={`text-purple-600 hover:text-purple-800 ${currentComment.rating > 0 ? 'text-green-500' : ''}`} 
                        onClick={() => handleVote(1)}>
                        ▲
                    </button>
                    <span className={`text-lg font-semibold ${currentComment.rating > 0 ? 'text-green-500' : currentComment.rating < 0 ? 'text-red-500' : 'text-gray-800'}`}>
                        {currentComment.rating}
                    </span>
                    <button 
                        className={`text-purple-600 hover:text-purple-800 ${currentComment.rating < 0 ? 'text-red-500' : ''}`} 
                        onClick={() => handleVote(-1)}>
                        ▼
                    </button>
                </div>
                <div className="flex-grow">
                    <div className="comment-header flex justify-between">
                        <a href={`/profile/${comment.username}`} className="font-bold text-purple-600 hover:underline">
                            {comment.username}
                        </a>
                        <span className="text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                        {isAdmin && (
                            <button 
                                onClick={() => setShowDeleteConfirm(true)} 
                                className="text-red-600 hover:text-red-800 ml-4">
                                <FaTrash />
                            </button>
                        )}
                    </div>
                    <div className="comment-content mt-2 text-gray-700">{comment.content}</div>
                    <div className="comment-actions mt-2 flex space-x-2">
                        {comment.replyCount > 0 && (
                            <>
                                <button
                                    className="text-purple-500 hover:underline"
                                    onClick={() => setShowReplies(!showReplies)}
                                >
                                    {showReplies ? 'Hide Replies' : 'Show Replies'} ({comment.replyCount})
                                </button>
                                {showAttachments && (
                                    <span className="mx-2 text-gray-400">•</span>
                                )}
                            </>
                        )}
                        <button
                            className="text-purple-500 hover:underline"
                            onClick={handleReplyToggle}
                        >
                            Reply
                        </button>
                        {attachments && attachments.length > 0 && (
                            <>
                                <span className="mx-2 text-gray-400">•</span>
                                <button
                                    className="text-purple-500 hover:underline"
                                    onClick={() => setShowAttachments(!showAttachments)}
                                >
                                    {showAttachments ? 'Hide Attachments' : 'Show Attachments'} ({attachments.length})
                                </button>
                            </>
                        )}
                    </div>

                    {showAttachments && attachments.length > 0 && (
                        <div className="attachments mt-2 mb-4">
                            <h4 className="font-semibold">Attachments:</h4>
                            <ul className="list-disc pl-4">
                                {attachments.map((attachment) => (
                                    <li key={attachment.attachmentId} className="text-blue-500 hover:underline">
                                        <a
                                            href={`http://localhost:8080/topicpage/attachments/download/${attachment.attachmentId}`}
                                            className="text-purple-500 underline hover:text-purple-700"
                                        >
                                            {attachment.filename}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {isReplying && (
                        <form onSubmit={handleReplySubmit} className="mt-2">
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write a reply..."
                                className="w-full p-2 border border-gray-300 rounded-md mt-2"
                            />
                            <input
                                type="file"
                                multiple
                                onChange={(e) => setReplyAttachments([...attachments, ...Array.from(e.target.files)])}
                                className="mb-2 w-full text-sm text-gray-500 border border-gray-300 rounded-md p-2 hover:bg-gray-50 transition"
                            />
                            <button type="submit" className="mt-2 mb-6 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                                Submit Reply
                            </button>
                        </form>
                    )}

                    {showReplies && replies.length > 0 && (
                        <div>
                            <ReplyList
                                replies={replies}
                                topicId={topicId}
                                handleReplyAdded={handleReplyAdded}
                                refreshTopic={refreshTopic}
                            />
                            {hasMoreReplies && totalReplies > replies.length && (
                                <button
                                    onClick={loadMoreReplies}
                                    className="mt-2 text-purple-500 hover:underline"
                                >
                                    Load More Replies
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {showDeleteConfirm && (
                <div className="delete-confirmation">
                    <p>Are you sure you want to delete this comment?</p>
                    <button onClick={handleDeleteComment} className="text-red-600 hover:text-red-800">Yes, delete</button>
                    <button onClick={() => setShowDeleteConfirm(false)} className="text-gray-600 hover:text-gray-800">Cancel</button>
                </div>
            )}
        </div>
    );
};

export default Comment;