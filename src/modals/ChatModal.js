import React, { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios'; // Import axios for making HTTP requests

const ChatModal = ({ isOpen, onClose }) => {
    const [chatRooms, setChatRooms] = useState([]); // State to hold chat rooms
    const [messages, setMessages] = useState([]); // State to hold chat messages
    const [newMessage, setNewMessage] = useState(''); // State for new message input
    const [selectedChatRoom, setSelectedChatRoom] = useState(null); // Selected chat room
    const client = useRef(null);

    useEffect(() => {
        if (isOpen) {
            // Fetch existing chat rooms on modal open
            axios.get('/api/chats') // Adjust the URL according to your server setup
                .then(response => {
                    setChatRooms(response.data);
                })
                .catch(error => {
                    console.error('Error fetching chat rooms:', error);
                });

            // Initialize STOMP client
            client.current = new Client({
                webSocketFactory: () => {
                    return new SockJS('http://localhost:8080/chat'); // Adjust the URL according to your server setup
                },
                debug: (str) => {
                    console.log(str);
                },
                onConnect: () => {
                    console.log('Connected to WebSocket');
                    // Subscribe to a topic to receive messages
                    client.current.subscribe('/topic/messages', (message) => {
                        if (message.body) {
                            setMessages((prevMessages) => [...prevMessages, JSON.parse(message.body)]);
                        }
                    });
                },
                onStompError: (frame) => {
                    console.error('Broker reported error: ' + frame.headers['message']);
                    console.error('Additional details: ' + frame.body);
                },
            });

            client.current.activate(); // Activate the client

            return () => {
                client.current.deactivate(); // Clean up on component unmount
            };
        }
    }, [isOpen]);

    // Function to send a message to the selected chat room
    const sendMessage = () => {
        if (!newMessage || !selectedChatRoom) return; // Prevent sending empty messages

        const chatMessageDto = {
            recipient: selectedChatRoom.recipient.username, // Assuming each chat room has a recipient object
            content: newMessage,
        };

        client.current.publish({
            destination: '/app/chat.sendMessage', // Adjust this destination based on your server setup
            body: JSON.stringify(chatMessageDto),
        });

        setNewMessage(''); // Clear the message input
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="bg-white shadow-lg rounded-lg w-4/5 h-4/5 flex relative z-10">
                {/* Chat Rooms List */}
                <div className="w-1/3 border-r">
                    <h2 className="text-lg font-bold p-4">Чаты</h2>
                    <div className="p-4">
                        {chatRooms.map((chatRoom) => (
                            <div
                                key={chatRoom.id}
                                className="chat-item p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setSelectedChatRoom(chatRoom);
                                    setMessages([]); // Clear messages when selecting a new chat room
                                }}
                            >
                                {chatRoom.recipient.username} {/* Adjust based on your ChatRoom structure */}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Messages and Input */}
                <div className="w-2/3 p-4">
                    <h2 className="text-lg font-bold">Переписка</h2>
                    <div className="chat-messages h-full overflow-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className="message p-2">
                                <strong>{msg.sender}: </strong>
                                {msg.content}
                            </div>
                        ))}
                    </div>
                    {/* Input for new message */}
                    <div className="flex mt-4">
                        <input
                            type="text"
                            className="border rounded p-2 w-full"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Введите сообщение..."
                        />
                        <button
                            className="bg-blue-500 text-white rounded p-2 ml-2"
                            onClick={sendMessage}
                        >
                            Отправить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatModal;
