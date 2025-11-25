'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';

export default function WooSettings() {
    const { settings, updateSettings } = useSettings();
    const [formData, setFormData] = useState(settings?.woo || {
        storeUrl: '',
        consumerKey: '',
        consumerSecret: '',
        apiVersion: 'wc/v3',
    });

    useEffect(() => {
        if (settings?.woo) {
            setFormData(settings.woo);
        } else {
            // Reset to defaults when user logs out
            setFormData({
                storeUrl: '',
                consumerKey: '',
                consumerSecret: '',
                apiVersion: 'wc/v3',
            });
        }
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        updateSettings({ woo: formData });
        alert('✅ Configuración de WooCommerce guardada!');
    };

    const handleTestConnection = async () => {
        if (!formData.storeUrl || !formData.consumerKey || !formData.consumerSecret) {
            alert('⚠️ Por favor completa todos los campos');
            return;
        }
        alert('✅ Prueba de conexión simulada: ¡Éxito!');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Store URL */}
            <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    URL de la Tienda
                </label>
                <div className="input-container">
                    <input
                        type="url"
                        name="storeUrl"
                        value={formData.storeUrl}
                        onChange={handleChange}
                        placeholder="https://tutienda.com"
                        className="chat-input"
                        autoComplete="off"
                    />
                </div>
            </div>

            {/* Consumer Key */}
            <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Consumer Key
                </label>
                <div className="input-container">
                    <input
                        type="text"
                        name="consumerKey"
                        value={formData.consumerKey}
                        onChange={handleChange}
                        placeholder="ck_..."
                        className="chat-input"
                        autoComplete="off"
                    />
                </div>
            </div>

            {/* Consumer Secret */}
            <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Consumer Secret
                </label>
                <div className="input-container">
                    <input
                        type="password"
                        name="consumerSecret"
                        value={formData.consumerSecret}
                        onChange={handleChange}
                        placeholder="cs_..."
                        className="chat-input"
                        autoComplete="off"
                    />
                </div>
            </div>

            {/* API Version */}
            <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Versión de API
                </label>
                <div className="input-container">
                    <select
                        name="apiVersion"
                        value={formData.apiVersion}
                        onChange={handleChange}
                        className="chat-input"
                        style={{ cursor: 'pointer' }}
                    >
                        <option value="wc/v3">v3 (Recomendada)</option>
                        <option value="wc/v2">v2</option>
                    </select>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1 }}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Guardar
                </button>
                <button onClick={handleTestConnection} className="btn btn-secondary" style={{ flex: 1 }}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Probar Conexión
                </button>
            </div>
        </div>
    );
}
