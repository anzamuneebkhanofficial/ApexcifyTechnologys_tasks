import { create } from 'zustand';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
}

interface AuthState {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
    setUser: (user) => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', user.token);
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
        set({ user });
    },
    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        set({ user: null });
    },
}));
