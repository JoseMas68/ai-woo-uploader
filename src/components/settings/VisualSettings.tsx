'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';

export default function VisualSettings() {
    const { settings, updateVisualSettings } = useSettings();
    const [formData, setFormData] = useState(settings?.visual || {
        primaryColor: '#3b82f6',
        secondaryColor: '#64748b',
        backgroundColor: '#ffffff',
        textColor: '#0f172a',
        accentColor: '#f59e0b',
        fontFamily: 'Inter, sans-serif',
        logo: null,
        iconSize: 24,
        darkMode: false,
    });

    useEffect(() => {
        if (settings?.visual) {
            setFormData(settings.visual);
        }
    }, [settings]);

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Aplicar inmediatamente para vista previa
        updateVisualSettings({ [name]: value });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        updateVisualSettings({ [name]: value });
    };

    const handleDarkModeToggle = () => {
        const newDarkMode = !formData.darkMode;
        setFormData(prev => ({ ...prev, darkMode: newDarkMode }));
        updateVisualSettings({ darkMode: newDarkMode });
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setFormData(prev => ({ ...prev, logo: base64 }));
                updateVisualSettings({ logo: base64 });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Color Palette */}
            <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.75rem' }}>
                    Paleta de Colores
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                        <label style={{ fontSize: '0.75rem', color: '#718096', display: 'block', marginBottom: '0.25rem' }}>
                            Primario
                        </label>
                        <input
                            type="color"
                            name="primaryColor"
                            value={formData.primaryColor}
                            onChange={handleColorChange}
                            style={{
                                width: '100%',
                                height: '48px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.75rem', color: '#718096', display: 'block', marginBottom: '0.25rem' }}>
                            Secundario
                        </label>
                        <input
                            type="color"
                            name="secondaryColor"
                            value={formData.secondaryColor}
                            onChange={handleColorChange}
                            style={{
                                width: '100%',
                                height: '48px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.75rem', color: '#718096', display: 'block', marginBottom: '0.25rem' }}>
                            Fondo
                        </label>
                        <input
                            type="color"
                            name="backgroundColor"
                            value={formData.backgroundColor}
                            onChange={handleColorChange}
                            style={{
                                width: '100%',
                                height: '48px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.75rem', color: '#718096', display: 'block', marginBottom: '0.25rem' }}>
                            Texto
                        </label>
                        <input
                            type="color"
                            name="textColor"
                            value={formData.textColor}
                            onChange={handleColorChange}
                            style={{
                                width: '100%',
                                height: '48px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Font Family */}
            <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Fuente
                </label>
                <div className="input-container">
                    <select
                        name="fontFamily"
                        value={formData.fontFamily}
                        onChange={handleSelectChange}
                        className="chat-input"
                        style={{ cursor: 'pointer' }}
                    >
                        <option value="Inter, sans-serif">Inter</option>
                        <option value="Roboto, sans-serif">Roboto</option>
                        <option value="Open Sans, sans-serif">Open Sans</option>
                        <option value="Lato, sans-serif">Lato</option>
                        <option value="Poppins, sans-serif">Poppins</option>
                    </select>
                </div>
            </div>

            {/* Dark Mode Toggle */}
            <div style={{
                background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div>
                    <label className="label" style={{ marginBottom: '0.25rem' }}>
                        Modo Oscuro
                    </label>
                    <p style={{ fontSize: '0.75rem', color: '#718096' }}>
                        Activa el tema oscuro para la aplicación
                    </p>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '52px', height: '28px', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={formData.darkMode}
                        onChange={handleDarkModeToggle}
                        style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: formData.darkMode ? '#667eea' : '#cbd5e0',
                        transition: '0.3s',
                        borderRadius: '28px'
                    }}>
                        <span style={{
                            position: 'absolute',
                            content: '',
                            height: '20px',
                            width: '20px',
                            left: formData.darkMode ? '28px' : '4px',
                            bottom: '4px',
                            backgroundColor: 'white',
                            transition: '0.3s',
                            borderRadius: '50%'
                        }} />
                    </span>
                </label>
            </div>

            {/* Logo Upload */}
            <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Subir Logo
                </label>
                <div className="input-container" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '1rem', gap: '1rem' }}>
                    <label htmlFor="logo-upload" className="btn btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Seleccionar Imagen
                    </label>
                    <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        style={{ display: 'none' }}
                    />
                    {formData.logo && (
                        <div style={{ width: '100%', padding: '0.75rem', background: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <img src={formData.logo} alt="Logo Preview" style={{ height: '64px', objectFit: 'contain', display: 'block', margin: '0 auto' }} />
                        </div>
                    )}
                </div>
            </div>

            {/* Info Note */}
            <div className="alert" style={{ background: '#e6fffa', border: '1px solid #81e6d9', color: '#234e52' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>
                    Los cambios se aplican en tiempo real. Cierra este panel para ver el efecto completo.
                </p>
            </div>
        </div>
    );
}
