'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/user';
import { getUsers, saveUser, getUser, hashPassword, setCurrentUserSession, getCurrentUserSession, clearCurrentUserSession } from '../lib/storage';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for existing session
        const userId = getCurrentUserSession();
        if (userId) {
            const users = getUsers();
            const foundUser = users.find(u => u.id === userId);
            if (foundUser) {
                setUser(foundUser);
            } else {
                clearCurrentUserSession();
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        const foundUser = getUser(email);
        if (!foundUser) return false;

        const hashedPassword = await hashPassword(password);
        if (foundUser.passwordHash === hashedPassword) {
            setUser(foundUser);
            setCurrentUserSession(foundUser.id);
            return true;
        }
        return false;
    };

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        if (getUser(email)) return false; // User already exists

        const hashedPassword = await hashPassword(password);
        const newUser: User = {
            id: crypto.randomUUID(),
            email,
            name,
            passwordHash: hashedPassword,
            createdAt: Date.now(),
        };

        saveUser(newUser);
        // Auto login after register
        setUser(newUser);
        setCurrentUserSession(newUser.id);
        return true;
    };

    const logout = () => {
        setUser(null);
        clearCurrentUserSession();
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};
