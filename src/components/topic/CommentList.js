import React from 'react';
import Comment from './Comment';

const CommentList = ({ comments, topicId, handleReplyAdded, onReplyClick, refreshTopic }) => {
    return (
        <div className="comment-list mt-4">
            {comments.map(comment => { 
            return (
                <Comment 
                    key={comment.createdAt.toString() + comment.commentId} 
                    comment={comment} 
                    topicId={topicId} 
                    handleReplyAdded={handleReplyAdded} 
                    onReplyClick={onReplyClick}
                    refreshTopic={refreshTopic}
                />
            )})}
        </div>
    );
};

export default CommentList;
