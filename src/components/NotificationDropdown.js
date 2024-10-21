import React, { useState, useEffect, useContext, useRef } from 'react';
import { FaBell, FaRegComment, FaHeart, FaReply, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import apiClient from '../axiosInstance';

const NotificationDropDown = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/user/notifications', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setNotifications(response.data ? response.data : []);
        } catch (error) {
            setError('Error fetching notifications. Please try again.');
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchNotifications();
            const intervalId = setInterval(fetchNotifications, 100000);
            return () => clearInterval(intervalId);
        }
    }, [isLoggedIn]);

    const toggleMenu = () => setMenuOpen((prev) => !prev);

    const markAsRead = async (id) => {
        try {
            await apiClient.post(`/user/notifications/${id}/mark-as-read`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setNotifications((prev) => prev.map(notification => notification.id === id ? { ...notification, read: true } : notification));
        } catch (error) {
            console.error('Error marking notification as read:', error);
            setError('Error marking notification as read.');
        }
    };

    const markAllAsRead = async () => {
        try {
            await apiClient.post('/user/notifications/mark-all-as-read', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setNotifications((prev) => prev.map(notification => ({ ...notification, read: true })));
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            setError('Error marking all notifications as read.');
        }
    };

    const deleteNotification = async (id) => {
        try {
            await apiClient.delete(`/user/notifications/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setNotifications((prev) => prev.filter(notification => notification.id !== id));
        } catch (error) {
            console.error('Error deleting notification:', error);
            setError('Error deleting notification.');
        }
    };

    const deleteAllNotifications = async () => {
        try {
            await apiClient.delete('/user/notifications/deleteAll', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setNotifications([]);
        } catch (error) {
            console.error('Error deleting all notifications:', error);
            setError('Error deleting all notifications.');
        }
    };

    const closeMenu = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', closeMenu);
        return () => document.removeEventListener('mousedown', closeMenu);
    }, []);

    const groupNotificationsByDate = (notifications) => {
        if(!Array.isArray(notifications)) {
            notifications = []
        }
        const grouped = { today: [], yesterday: [], older: [] };
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        notifications.forEach(notification => {
            const notificationDate = new Date(notification.timestamp);
            if (notificationDate.toDateString() === today.toDateString()) {
                grouped.today.push(notification);
            } else if (notificationDate.toDateString() === yesterday.toDateString()) {
                grouped.yesterday.push(notification);
            } else {
                grouped.older.push(notification);
            }
        });

        return grouped;
    };

    const groupedNotifications = groupNotificationsByDate(notifications);
    const hasUnreadNotifications = notifications.some(notification => !notification.read);

    return (
        <div className="relative mr-3">
            <button onClick={toggleMenu} className="flex items-center text-purple-600" aria-haspopup="true" aria-expanded={menuOpen}>
                <div className="relative flex items-center">
                    <FaBell />
                    {hasUnreadNotifications && (
                        <FaExclamationTriangle className="absolute top-1.5 right-0 left-1.5 text-red-500 text-xs" />
                    )}
                </div>
            </button>
            {menuOpen && (
                <div 
                    ref={dropdownRef} 
                    className="absolute right-0 bg-white border border-gray-300 shadow-lg mt-2 w-128 rounded-lg z-10 max-h-80 overflow-hidden"
                    style={{ width: '480px' }}
                >
                    <div className="py-2 px-4 font-semibold border-b bg-white z-10 sticky top-0 flex justify-between items-center">
                        <span>Notifications</span>
                        <div>
                            <button onClick={markAllAsRead} className="text-sm text-green-400 hover:underline mr-2">Read All</button>
                            <button onClick={deleteAllNotifications} className="text-sm text-red-600 hover:underline">Delete All</button>
                        </div>
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                        {loading ? (
                            <div className="p-4">Loading...</div>
                        ) : error ? (
                            <div className="p-4 text-red-600">{error}</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-4">No notifications. Check back later!</div>
                        ) : (
                            <>
                                {groupedNotifications.today.length > 0 && (
                                    <>
                                        <div className="py-2 px-4 font-semibold border-b bg-gray-100">Today</div>
                                        {groupedNotifications.today.map(notification => (
                                            <NotificationItem
                                                key={notification.id}
                                                notification={notification}
                                                markAsRead={markAsRead}
                                                deleteNotification={deleteNotification}
                                            />
                                        ))}
                                    </>
                                )}
                                {groupedNotifications.yesterday.length > 0 && (
                                    <>
                                        <div className="py-2 px-4 font-semibold border-b bg-gray-100">Yesterday</div>
                                        {groupedNotifications.yesterday.map(notification => (
                                            <NotificationItem
                                                key={notification.id}
                                                notification={notification}
                                                markAsRead={markAsRead}
                                                deleteNotification={deleteNotification}
                                            />
                                        ))}
                                    </>
                                )}
                                {groupedNotifications.older.length > 0 && (
                                    <>
                                        <div className="py-2 px-4 font-semibold border-b bg-gray-100">Older Notifications</div>
                                        {groupedNotifications.older.map(notification => (
                                            <NotificationItem
                                                key={notification.id}
                                                notification={notification}
                                                markAsRead={markAsRead}
                                                deleteNotification={deleteNotification}
                                            />
                                        ))}
                                    </>
                                )}
                                <div className="h-4"></div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const NotificationItem = ({ notification, markAsRead, deleteNotification }) => {
    const renderIcon = () => {
        switch (notification.notificationType) {
            case 'COMMENT':
                return <FaRegComment className="text-blue-500" />;
            case 'LIKE':
                return <FaHeart className="text-green-500" />;
            case 'REPLY':
                return <FaReply className="text-yellow-500" />;
            default:
                return null;
        }
    };

    return (
        <div className={`flex justify-between items-center p-4 hover:bg-gray-200 ${!notification.read ? 'border-l-4 border-green-500' : ''}`}>
            <div className="flex items-center">
                <Link to={`/profile/${notification.actorUsername}`} className="flex items-center text-purple-600 hover:underline">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white outline outline-gray-100 outline-width: 1px;">
                        {renderIcon()}
                    </div>
                    <span className="ml-4 border-r pr-3">{notification.actorUsername}</span>
                </Link>
            </div>

            <div className="flex-1 text-left ml-3 border-gray-300 mx-2">
                <Link to={`/topic/${notification.topicId}`} onClick={() => markAsRead(notification.id)} className="text-purple-600 hover:underline">
                    {notification.message}
                </Link>
            </div>
            <button
                className="text-green-400 hover:text-gray-600 mr-3"
                onClick={() => markAsRead(notification.id)}
            >
                <FaCheck />
            </button>
            <button
                className="text-red-400 hover:text-gray-600"
                onClick={() => deleteNotification(notification.id)}
            >
                <FaTimes />
            </button>
        </div>
    );
};

export default NotificationDropDown;
