export interface User {
    id: string;
    email: string;
    name: string;
    passwordHash: string; // In a real app, this would be salted and hashed properly. For this demo, we'll do a simple hash.
    createdAt: number;
}

export interface WooSettings {
    storeUrl: string;
    consumerKey: string;
    consumerSecret: string;
    apiVersion: string;
}

export interface AISettings {
    provider: 'openai' | 'groq' | 'huggingface' | 'custom';
    apiKey: string;
    model: string;
    temperature: number;
    maxTokens: number;
}

export interface VisualSettings {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    fontFamily: string;
    logo: string | null; // Base64 string
    iconSize: number;
    darkMode: boolean;
}

export interface FunctionalSettings {
    autoGenerateImages: boolean;
    autoPublish: boolean;
    showOptionalFields: boolean;
    language: 'en' | 'es' | 'fr' | 'de';
}

export interface UserSettings {
    userId: string;
    woo: WooSettings;
    ai: AISettings;
    visual: VisualSettings;
    functional: FunctionalSettings;
}

export const DEFAULT_VISUAL_SETTINGS: VisualSettings = {
    primaryColor: '#3b82f6', // blue-500
    secondaryColor: '#64748b', // slate-500
    backgroundColor: '#ffffff',
    textColor: '#0f172a', // slate-900
    accentColor: '#f59e0b', // amber-500
    fontFamily: 'Inter, sans-serif',
    logo: null,
    iconSize: 24,
    darkMode: false,
};

export const DEFAULT_FUNCTIONAL_SETTINGS: FunctionalSettings = {
    autoGenerateImages: false,
    autoPublish: false,
    showOptionalFields: true,
    language: 'en',
};

export const DEFAULT_WOO_SETTINGS: WooSettings = {
    storeUrl: '',
    consumerKey: '',
    consumerSecret: '',
    apiVersion: 'wc/v3',
};

export const DEFAULT_AI_SETTINGS: AISettings = {
    provider: 'openai',
    apiKey: '',
    model: 'gpt-4-turbo',
    temperature: 0.7,
    maxTokens: 1000,
};
