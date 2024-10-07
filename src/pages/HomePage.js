import React, { useEffect, useState, useCallback, useContext } from 'react';
import Header from '../components/Header';
import TopicList from '../components/TopicList';
import TopicCard from '../components/TopicCard';
import SearchModal from '../modals/SearchModal';
import SearchBar from '../components/SearchBar';
import CreateTopicModal from '../modals/CreateTopicModal';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
    const { isLoggedIn, username, logout } = useContext(AuthContext);
    const [topics, setTopics] = useState([]);
    const [filteredTopics, setFilteredTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchTopics = useCallback(async (pageNum = 0) => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/homepage/getAllTopics?page=${pageNum}&sort=createdAt,desc`);
            const data = await response.json();
            setTopics((prevTopics) => [...prevTopics, ...data.content]);
            setTotalPages(data.totalPages);
            setHasMore(pageNum < data.totalPages - 1);
        } catch (error) {
            console.error('Error fetching topics:', error);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore]);

    useEffect(() => {
        fetchTopics();
    }, []);

    useEffect(() => {
        if (searchQuery === "") {
            setFilteredTopics(topics);
        } else {
            const filtered = topics.filter(topic =>
                topic.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredTopics(filtered);
        }
    }, [searchQuery, topics]);

    const handleScroll = useCallback(() => {
        const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
        if (bottom && hasMore) {
            setPage(page + 1);
            fetchTopics(page + 1);
            console.log(page)
        }
    }, [hasMore]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const handleOpenSearchModal = () => {
        setIsSearchModalOpen(true);
    };

    const handleCloseSearchModal = () => {
        setIsSearchModalOpen(false);
    };

    const handleSearchInputChange = (query) => {
        setSearchQuery(query);
    };

    const handleSearchResults = (results) => {
        console.log("Received search results:", results);
        if (results && results.content) {
            setTopics(results.content);
            if (results.content === "[]") {
                setFilteredTopics([]);
            } else {
                setFilteredTopics(results.content);
            }
        } else {
            console.error('Expected search results to have content array:', results);
        }
    };

    const handleOpenCreateTopicModal = () => {
        setIsCreateTopicModalOpen(true);
    };

    const handleCloseCreateTopicModal = () => {
        setIsCreateTopicModalOpen(false);
    };

    const handleTopicCreated = () => {
        fetchTopics();
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header isLoggedIn={isLoggedIn} username={username} onLogout={logout} />
            <div className="flex justify-between items-center mt-4 mx-4">
                <SearchBar onOpen={handleOpenSearchModal} onSearchInputChange={handleSearchInputChange} isLoggedIn={isLoggedIn} onOpenCreateTopicModal={handleOpenCreateTopicModal} />
            </div>

            <main className="flex-grow p-4">
            {(filteredTopics.length === 0 || searchQuery === "" && filteredTopics.length === 1) && (
                <div className="mt-4 text-center text-gray-600">
                    No topics found that match your criteria.
                </div>
            )}
                <TopicList>
                    {filteredTopics.map((topic) => (
                        <TopicCard key={topic.topicId} topic={topic} />
                    ))}
                </TopicList>
                {loading && (
                    <div className="text-center mt-4">Loading more topics...</div>
                )}
            </main>
            <SearchModal
                isOpen={isSearchModalOpen}
                onClose={handleCloseSearchModal}
                onSearch={handleSearchResults}
                isLoggedIn={isLoggedIn}
            />
            <CreateTopicModal
                isOpen={isCreateTopicModalOpen}
                onClose={handleCloseCreateTopicModal}
                onTopicCreated={handleTopicCreated}
            />
        </div>
    );
};

export default HomePage;
