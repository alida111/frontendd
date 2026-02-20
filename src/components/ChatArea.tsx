'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore, Message } from '../store/useChatStore';
import { socket } from '../services/socket';
import { cn } from '../lib/utils';
import axios from 'axios';
import { Send, Paperclip, Smile } from 'lucide-react';

export default function ChatArea() {
    const { user } = useAuthStore();
    const { activeChat, messages, setMessages, addMessage } = useChatStore();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeChat) {
            socket.emit('join_chat', activeChat.id);

            const fetchMessages = async () => {
                try {
                    const token = useAuthStore.getState().token;
                    const res = await axios.get(`http://localhost:4000/api/messages/${activeChat.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setMessages(res.data);
                    messagesEndRef.current?.scrollIntoView();
                } catch (error) {
                    console.error(error);
                }
            };

            fetchMessages();

            return () => {
                socket.emit('leave_chat', activeChat.id);
            };
        }
    }, [activeChat, setMessages]);

    useEffect(() => {
        // Listen for incoming messages
        // Note: In a real app we'd set up this listener once at a higher level or handle cleanup carefully to avoid duplicates
        // For this basic setup, we'll assume the socket service handles it or we do it here
        // Actually, we haven't implemented 'receive_message' on backend socket logic yet in the snippet provided, 
        // but we should in a full app. I'll add a placeholder.
    }, []);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !activeChat || !user) return;

        try {
            const token = useAuthStore.getState().token;
            const res = await axios.post('http://localhost:4000/api/messages', {
                chatId: activeChat.id,
                content: inputValue,
                type: 'text'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const newMessage = res.data;
            addMessage(newMessage);
            setInputValue('');
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

            // Emit socket event if backend was listening, but backend currently just saves to DB. 
            // Ideally backend emits 'receive_message' to everyone in room after saving.
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    if (!activeChat) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500">
                Select a chat to start messaging
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="p-4 border-b flex items-center bg-white dark:bg-gray-800 shadow-sm z-10">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3" />
                <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                        {activeChat.type === 'private'
                            ? activeChat.members.find(m => m.userId !== user?.id)?.user.name
                            : activeChat.name}
                    </h2>
                    <span className="text-xs text-gray-500">Online</span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                {messages.map((msg) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                        <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                            <div className={cn(
                                "max-w-[70%] rounded-2xl px-4 py-2 shadow-sm",
                                isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none border"
                            )}>
                                <p>{msg.content}</p>
                                <div className={cn(
                                    "text-[10px] mt-1 text-right",
                                    isMe ? "text-blue-100" : "text-gray-400"
                                )}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <button type="button" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                        <Paperclip size={20} />
                    </button>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4"
                    />
                    <button type="button" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                        <Smile size={20} />
                    </button>
                    <button type="submit" className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
