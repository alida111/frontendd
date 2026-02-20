import { create } from 'zustand';

export interface User {
    id: string;
    name: string;
    avatar?: string;
    status?: string;
}

export interface Message {
    id: string;
    content: string;
    senderId: string;
    sender?: User;
    isRead: boolean;
    createdAt: string;
    type?: 'text' | 'image' | 'video' | 'file';
    fileUrl?: string;
}

export interface Chat {
    id: string;
    name?: string;
    type: 'private' | 'group';
    members: { userId: string, user: User }[];
    messages: Message[];
    updatedAt: string;
    avatar?: string;
}

interface ChatState {
    chats: Chat[];
    activeChat: Chat | null;
    messages: Message[];
    isLoading: boolean;
    setChats: (chats: Chat[]) => void;
    setActiveChat: (chat: Chat | null) => void;
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    updateChat: (chatId: string, data: Partial<Chat>) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    chats: [],
    activeChat: null,
    messages: [],
    isLoading: false,
    setChats: (chats) => set({ chats }),
    setActiveChat: (activeChat) => set({ activeChat }),
    setMessages: (messages) => set({ messages }),
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    updateChat: (chatId, data) => set((state) => ({
        chats: state.chats.map(chat => chat.id === chatId ? { ...chat, ...data } : chat)
    })),
}));
