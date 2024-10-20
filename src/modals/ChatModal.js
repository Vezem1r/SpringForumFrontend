import React, {useContext, useEffect, useRef, useState} from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import {AuthContext} from "../context/AuthContext"; // Import axios for making HTTP requests

const ChatModal = ({ isOpen, onClose }) => {
    const [chatRooms, setChatRooms] = useState([]); // State to hold chat rooms
    const [messages, setMessages] = useState([]); // State to hold chat messages
    const [newMessage, setNewMessage] = useState(''); // State for new message input
    const [selectedChatRoom, setSelectedChatRoom] = useState(null); // Selected chat room
    const client = useRef(null);
    const { username } = useContext(AuthContext);
    const [chatRoomId, setChatRoomId] = useState(-1);

    useEffect(() => {
        if (isOpen) {
            const token = localStorage.getItem('token');

            // Initialize STOMP client
            client.current = new Client({
                webSocketFactory: () => {
                    return new SockJS('http://localhost:8080/connect'); // Adjust the URL according to your server setup
                },
                debug: (str) => {
                    console.log(str);
                },
                onConnect: () => {
                    console.log('Connected to WebSocket');
                    axios.get("http://localhost:8080/chatRoom/all", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }).then(response => {
                        console.log(response)
                        const responseChatRoomId = response.data[0].id;
                        setChatRoomId(responseChatRoomId);
                        client.current.subscribe(`/message/${responseChatRoomId}`, (message) => {
                            message = JSON.parse(message.body);
                            setMessages((prevMessages) => [...prevMessages, message]);
                        });
                        axios.get(`http://localhost:8080/chatRoom/${responseChatRoomId}/messages`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                        }}).then(response => {
                            setMessages(response.data)
                            console.log(response.data)
                        });
                    })
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
        // if (!newMessage || !selectedChatRoom) return; // Prevent sending empty messages
        if (!newMessage) return;

        const chatMessageDto = {
            chatRoomId: chatRoomId,
            senderUsername: username,
            recipientUsername: "Guest",
            content: newMessage,
        };

        client.current.publish({ destination: '/app/chat', body: JSON.stringify(chatMessageDto) });

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
                                <strong>{msg.sender.username}: </strong>
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
