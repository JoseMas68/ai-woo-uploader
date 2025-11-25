'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { AISettings as AISettingsType } from '../../types/user';

export default function AISettings() {
    const { settings, updateSettings } = useSettings();
    const [formData, setFormData] = useState<AISettingsType>(settings?.ai || {
        provider: 'openai',
        apiKey: '',
        model: 'gpt-4-turbo',
        temperature: 0.7,
        maxTokens: 1000,
    });

    useEffect(() => {
        if (settings?.ai) {
            setFormData(settings.ai);
        } else {
            // Reset to defaults when user logs out
            setFormData({
                provider: 'openai',
                apiKey: '',
                model: 'gpt-4-turbo',
                temperature: 0.7,
                maxTokens: 1000,
            });
        }
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'temperature' || name === 'maxTokens' ? Number(value) : value
        }));
    };

    const handleSave = () => {
        updateSettings({ ai: formData });
        alert('✅ Configuración de IA guardada!');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Provider */}
            <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Proveedor de IA
                </label>
                <div className="input-container">
                    <select
                        name="provider"
                        value={formData.provider}
                        onChange={handleChange}
                        className="chat-input"
                        style={{ cursor: 'pointer' }}
                    >
                        <option value="openai">OpenAI</option>
                        <option value="groq">Groq</option>
                        <option value="huggingface">HuggingFace</option>
                        <option value="custom">Personalizado</option>
                    </select>
                </div>
            </div>

            {/* API Key */}
            <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    API Key
                </label>
                <div className="input-container">
                    <input
                        type="password"
                        name="apiKey"
                        value={formData.apiKey}
                        onChange={handleChange}
                        placeholder="sk-..."
                        className="chat-input"
                        autoComplete="off"
                    />
                </div>
            </div>

            {/* Model */}
            <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Modelo
                </label>
                <div className="input-container">
                    <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        placeholder="gpt-4-turbo"
                        className="chat-input"
                        autoComplete="off"
                    />
                </div>
            </div>

            {/* Temperature */}
            <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Temperatura: <strong style={{ color: '#667eea' }}>{formData.temperature}</strong>
                </label>
                <input
                    type="range"
                    name="temperature"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.temperature}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        height: '6px',
                        borderRadius: '3px',
                        background: 'linear-gradient(to right, #667eea 0%, #764ba2 100%)',
                        outline: 'none',
                        cursor: 'pointer'
                    }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#718096', marginTop: '0.25rem' }}>
                    <span>Preciso (0)</span>
                    <span>Balanceado (0.5)</span>
                    <span>Creativo (1)</span>
                </div>
            </div>

            {/* Max Tokens */}
            <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Máximo de Tokens
                </label>
                <div className="input-container">
                    <input
                        type="number"
                        name="maxTokens"
                        value={formData.maxTokens}
                        onChange={handleChange}
                        min="100"
                        max="4000"
                        step="100"
                        className="chat-input"
                        autoComplete="off"
                    />
                </div>
            </div>

            {/* Save Button */}
            <button onClick={handleSave} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Guardar Configuración de IA
            </button>
        </div>
    );
}
