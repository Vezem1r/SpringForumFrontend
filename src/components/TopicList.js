import React from 'react';

const TopicList = ({ children }) => {
    return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 border-t border-gray-200">
            {children}
        </div>
    );
};

export default TopicList;
