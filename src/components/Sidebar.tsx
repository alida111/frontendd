'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import { socket } from '../services/socket';
import { cn } from '../lib/utils';
import axios from 'axios';
import { Plus, Search, X, Loader2, MessageSquare } from 'lucide-react';

export default function Sidebar() {
    const { user } = useAuthStore();
    const { chats, setChats, activeChat, setActiveChat } = useChatStore();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const fetchChats = async () => {
            if (!user) return;
            try {
                const token = useAuthStore.getState().token;
                const res = await axios.get('http://localhost:4000/api/chats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setChats(res.data);
            } catch (error) {
                console.error('Failed to fetch chats', error);
            }
        };

        fetchChats();
    }, [user, setChats]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const token = useAuthStore.getState().token;
            const res = await axios.get(`http://localhost:4000/api/users/search?query=${searchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSearchResults(res.data);
        } catch (error) {
            console.error('Search failed', error);
        } finally {
            setIsSearching(false);
        }
    };

    const startChat = async (partnerId: string) => {
        try {
            const token = useAuthStore.getState().token;
            const res = await axios.post('http://localhost:4000/api/chats/private', {
                partnerId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const newChat = res.data;
            // Check if chat already exists in list
            if (!chats.find(c => c.id === newChat.id)) {
                setChats([newChat, ...chats]);
            }
            setActiveChat(newChat);
            setIsSearchOpen(false);
            setSearchQuery('');
            setSearchResults([]);
        } catch (error) {
            console.error('Failed to start chat', error);
        }
    };

    return (
        <div className="w-80 border-r h-full flex flex-col bg-white dark:bg-gray-900 relative">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-2">
                    {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            {user?.name?.[0].toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h2 className="font-semibold text-gray-800 dark:text-white">{user?.name}</h2>
                        <span className="text-xs text-green-500">Online</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                    title="Add Friend / New Chat"
                >
                    <Plus size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
            </div>

            {/* Search Modal / Overlay */}
            {isSearchOpen && (
                <div className="absolute inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col">
                    <div className="p-4 border-b flex items-center gap-2">
                        <Search size={20} className="text-gray-400" />
                        <form onSubmit={handleSearch} className="flex-1">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search users..."
                                className="w-full bg-transparent focus:outline-none dark:text-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                        <button onClick={() => setIsSearchOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        {isSearching ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="animate-spin text-blue-500" />
                            </div>
                        ) : searchResults.length > 0 ? (
                            searchResults.map(resultUser => (
                                <div key={resultUser.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                                            {resultUser.name[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium dark:text-white">{resultUser.name}</p>
                                            <p className="text-xs text-gray-500">{resultUser.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => startChat(resultUser.id)}
                                        className="p-2 bg-blue-100 text-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-200"
                                    >
                                        <MessageSquare size={16} />
                                    </button>
                                </div>
                            ))
                        ) : searchQuery && (
                            <p className="text-center text-gray-500 mt-4">No users found</p>
                        )}
                        {!searchQuery && (
                            <div className="p-4 text-center text-gray-400 text-sm">
                                Type to search for friends by name or email
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="overflow-y-auto flex-1">
                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        onClick={() => setActiveChat(chat)}
                        className={cn(
                            "p-4 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                            activeChat?.id === chat.id && "bg-blue-50 dark:bg-gray-800"
                        )}
                    >
                        <div className="flex gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between">
                                    <h3 className="font-medium truncate text-gray-900 dark:text-gray-100">
                                        {chat.type === 'private'
                                            ? chat.members.find(m => m.userId !== user?.id)?.user.name
                                            : chat.name}
                                    </h3>
                                    <span className="text-xs text-gray-500">
                                        {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 truncate">
                                    {chat.messages?.[0]?.content || "No messages yet"}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                {chats.length === 0 && !isSearchOpen && (
                    <div className="p-8 text-center text-gray-500">
                        No chats yet. Click + to find friends!
                    </div>
                )}
            </div>
        </div>
    );
}
