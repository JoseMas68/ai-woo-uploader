'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserSettings, VisualSettings, DEFAULT_VISUAL_SETTINGS, DEFAULT_FUNCTIONAL_SETTINGS, DEFAULT_WOO_SETTINGS, DEFAULT_AI_SETTINGS } from '../types/user';
import { getSettings, saveSettings } from '../lib/storage';
import { useAuth } from './AuthContext';

interface SettingsContextType {
    settings: UserSettings | null;
    updateSettings: (newSettings: Partial<UserSettings>) => void;
    updateVisualSettings: (visual: Partial<VisualSettings>) => void;
    isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load settings when user changes
    useEffect(() => {
        if (user) {
            const userSettings = getSettings(user.id);
            setSettings(userSettings);
            applyVisualSettings(userSettings.visual);
        } else {
            setSettings(null);
            // Reset to defaults or keep last applied? Let's reset to a safe default
            applyVisualSettings(DEFAULT_VISUAL_SETTINGS);
        }
        setIsLoading(false);
    }, [user]);

    const applyVisualSettings = (visual: VisualSettings) => {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', visual.primaryColor);
        root.style.setProperty('--secondary-color', visual.secondaryColor);
        root.style.setProperty('--background-color', visual.backgroundColor);
        root.style.setProperty('--text-color', visual.textColor);
        root.style.setProperty('--accent-color', visual.accentColor);
        root.style.setProperty('--font-family', visual.fontFamily);

        if (visual.darkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };

    const updateSettings = (newSettings: Partial<UserSettings>) => {
        if (!user || !settings) return;

        const updatedSettings = { ...settings, ...newSettings };
        setSettings(updatedSettings);
        saveSettings(user.id, updatedSettings);

        if (newSettings.visual) {
            applyVisualSettings(updatedSettings.visual);
        }
    };

    const updateVisualSettings = (visual: Partial<VisualSettings>) => {
        if (!user || !settings) return;

        const updatedVisual = { ...settings.visual, ...visual };
        updateSettings({ visual: updatedVisual });
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, updateVisualSettings, isLoading }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
