import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import TagManagement from '../components/admin/TagManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import Header from '../components/Header';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTagManagement, setShowTagManagement] = useState(false);
    const [showCategoryManagement, setShowCategoryManagement] = useState(false);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/admin/dashboard', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAdminData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    if (loading) {
        return <div className="text-center text-gray-600">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    const usersData = {
        labels: ['Total Users', 'Logged In Today'],
        datasets: [
            {
                data: [adminData.totalUsers, adminData.loggedInTodayUsers],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
            },
        ],
    };

    const topicsData = {
        labels: ['Total Topics', 'Topics Created Today'],
        datasets: [
            {
                data: [adminData.totalTopics, adminData.topicsCreatedToday],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
            },
        ],
    };

    const commentsData = {
        labels: ['Total Comments', 'Comments Created Today'],
        datasets: [
            {
                data: [adminData.totalComments, adminData.commentsCreatedToday],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
            },
        ],
    };

    return (
        <div>
        <Header />
        <div className="container mx-auto p-6 bg-gray-100">
            <header className="mb-6">
                <h1 className="text-5xl font-bold text-purple-600">Admin Dashboard</h1>
                <p className="text-gray-600 text-lg">Overview of the forum's statistics</p>
            </header>
            <div className="flex space-x-4 mb-4">
                <button
                    onClick={() => setShowTagManagement(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md"
                >
                    Manage Tags
                </button>
                <button
                    onClick={() => setShowCategoryManagement(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md"
                >
                    Manage Categories
                </button>
            </div>
            {showTagManagement && (
                <TagManagement onClose={() => setShowTagManagement(false)} />
            )}

            {showCategoryManagement && (
                <CategoryManagement onClose={()  => setShowCategoryManagement(false)} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105">
                    <h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
                    <p className="text-3xl font-bold text-gray-900">{adminData.totalUsers}</p>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105">
                    <h2 className="text-xl font-semibold text-gray-700">Total Topics</h2>
                    <p className="text-3xl font-bold text-gray-900">{adminData.totalTopics}</p>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105">
                    <h2 className="text-xl font-semibold text-gray-700">Total Comments</h2>
                    <p className="text-3xl font-bold text-gray-900">{adminData.totalComments}</p>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105">
                    <h2 className="text-xl font-semibold text-gray-700">Logged In Today</h2>
                    <p className="text-3xl font-bold text-gray-900">{adminData.loggedInTodayUsers}</p>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105">
                    <h2 className="text-xl font-semibold text-gray-700">Topics Created Today</h2>
                    <p className="text-3xl font-bold text-gray-900">{adminData.topicsCreatedToday}</p>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105">
                    <h2 className="text-xl font-semibold text-gray-700">Comments Created Today</h2>
                    <p className="text-3xl font-bold text-gray-900">{adminData.commentsCreatedToday}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105">
                    <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
                    <Doughnut data={usersData} options={{ responsive: true }} />
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105">
                    <h2 className="text-xl font-semibold mb-4">Topic Statistics</h2>
                    <Doughnut data={topicsData} options={{ responsive: true }} />
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105">
                    <h2 className="text-xl font-semibold mb-4">Comment Statistics</h2>
                    <Doughnut data={commentsData} options={{ responsive: true }} />
                </div>
            </div>
        </div>
        </div>
    );
};

export default AdminDashboard;
