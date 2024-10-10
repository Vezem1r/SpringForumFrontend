import React from 'react';
import Comment from './Comment';

const ReplyList = ({ replies, topicId, handleReplyAdded, refreshTopic }) => {
    return (
        <div className="reply-list mt-2">
            {replies.map(reply => (
                <Comment 
                    key={reply.createdAt.toString() + reply.commentId} 
                    comment={reply} 
                    topicId={topicId} 
                    handleReplyAdded={handleReplyAdded} 
                    refreshTopic={refreshTopic}
                />
            ))}
        </div>
    );
};

export default ReplyList;
