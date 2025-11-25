import { User, UserSettings, DEFAULT_VISUAL_SETTINGS, DEFAULT_FUNCTIONAL_SETTINGS, DEFAULT_WOO_SETTINGS, DEFAULT_AI_SETTINGS } from '../types/user';

const USERS_KEY = 'ai_woo_users';
const SETTINGS_KEY_PREFIX = 'ai_woo_settings_';
const CURRENT_USER_KEY = 'ai_woo_current_user_id';

// Simple hash function for demo purposes (NOT SECURE for production)
export const hashPassword = async (password: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const getUsers = (): User[] => {
    if (typeof window === 'undefined') return [];
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
};

export const saveUser = (user: User): void => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getUser = (email: string): User | undefined => {
    const users = getUsers();
    return users.find(u => u.email === email);
};

export const saveSettings = (userId: string, settings: UserSettings): void => {
    localStorage.setItem(SETTINGS_KEY_PREFIX + userId, JSON.stringify(settings));
};

export const getSettings = (userId: string): UserSettings => {
    const settingsJson = localStorage.getItem(SETTINGS_KEY_PREFIX + userId);
    if (settingsJson) {
        return JSON.parse(settingsJson);
    }

    // Return defaults if no settings found
    return {
        userId,
        woo: { ...DEFAULT_WOO_SETTINGS },
        ai: { ...DEFAULT_AI_SETTINGS },
        visual: { ...DEFAULT_VISUAL_SETTINGS },
        functional: { ...DEFAULT_FUNCTIONAL_SETTINGS },
    };
};

export const setCurrentUserSession = (userId: string): void => {
    localStorage.setItem(CURRENT_USER_KEY, userId);
};

export const getCurrentUserSession = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(CURRENT_USER_KEY);
};

export const clearCurrentUserSession = (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
};
