'use client';

import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

export default function SettingsOnboarding({ onClose }: { onClose: () => void }) {
    const { settings, updateSettings } = useSettings();
    const [stepIndex, setStepIndex] = useState(0);
    const [formData, setFormData] = useState({
        storeUrl: settings?.woo?.storeUrl || '',
        consumerKey: settings?.woo?.consumerKey || '',
        consumerSecret: settings?.woo?.consumerSecret || '',
        aiApiKey: settings?.ai?.apiKey || '',
    });

    // Steps for the onboarding wizard
    const steps = [
        { title: 'Bienvenido', description: 'Configura tu tienda WooCommerce para habilitar el asistente.' },
        { title: 'Store URL', field: 'storeUrl', placeholder: 'https://mi-tienda.com' },
        { title: 'Consumer Key', field: 'consumerKey', placeholder: 'ck_XXXXXXXXXXXXXXXX' },
        { title: 'Consumer Secret', field: 'consumerSecret', placeholder: 'cs_XXXXXXXXXXXXXXXX' },
        { title: 'OpenAI API Key', field: 'aiApiKey', placeholder: 'sk-XXXXXXXXXXXXXXXX' },
        { title: 'Resumen', description: 'Revisa y guarda tus credenciales.' },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => {
        if (stepIndex === steps.length - 1) {
            // Preserve existing Woo settings (including apiVersion) while updating credentials
            const updatedWoo = {
                ...(settings?.woo || { apiVersion: 'wc/v3' }),
                storeUrl: formData.storeUrl,
                consumerKey: formData.consumerKey,
                consumerSecret: formData.consumerSecret
            };

            // Update AI settings
            const updatedAI = {
                ...(settings?.ai || {
                    provider: 'openai',
                    model: 'gpt-4-turbo',
                    temperature: 0.7,
                    maxTokens: 1000
                }),
                apiKey: formData.aiApiKey
            };

            updateSettings({ woo: updatedWoo, ai: updatedAI });
            onClose();
        } else {
            setStepIndex(stepIndex + 1);
        }
    };

    const handleBack = () => {
        if (stepIndex > 0) setStepIndex(stepIndex - 1);
    };

    const current = steps[stepIndex];

    return (
        <>
            {/* Overlay oscuro separado */}
            <div
                className="fixed inset-0 w-screen h-screen"
                style={{
                    background: 'rgba(0, 0, 0, 0.85)',
                    zIndex: 9998,
                    animation: 'fadeIn 0.2s ease-out'
                }}
                onClick={onClose}
            />

            {/* Modal por encima del overlay */}
            <div
                className="fixed inset-0 w-screen h-screen flex items-center justify-center p-4"
                style={{
                    zIndex: 9999,
                    pointerEvents: 'none'
                }}
            >
                <div
                    style={{
                        width: '100%',
                        maxWidth: '48rem',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '3rem',
                        gap: '2.5rem',
                        background: '#f7fafc',
                        borderRadius: '20px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        animation: 'fadeIn 0.3s ease-out',
                        pointerEvents: 'auto'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div>
                        <h2 className="chat-title" style={{ marginBottom: '1rem', fontSize: '2rem' }}>
                            {current.title}
                        </h2>
                        {current.description && (
                            <p className="chat-subtitle" style={{ fontSize: '1.25rem' }}>
                                {current.description}
                            </p>
                        )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                        {current.field && (
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="label" style={{ display: 'block', marginBottom: '0.75rem' }}>
                                    {current.title}
                                </label>
                                <div className="input-container">
                                    <input
                                        type={current.field === 'aiApiKey' ? 'password' : 'text'}
                                        name={current.field}
                                        placeholder={current.placeholder}
                                        value={(formData as any)[current.field]}
                                        onChange={handleChange}
                                        className="chat-input"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                        )}
                        {stepIndex === steps.length - 1 && (
                            <div className="bg-white p-8 rounded-xl border border-gray-200 space-y-6 text-lg">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-600">Store URL:</span>
                                    <span className="text-gray-900 truncate max-w-[400px] font-mono bg-gray-50 px-3 py-1 rounded">{formData.storeUrl}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-600">Consumer Key:</span>
                                    <span className="text-gray-900 truncate max-w-[400px] font-mono bg-gray-50 px-3 py-1 rounded">{formData.consumerKey}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-600">Consumer Secret:</span>
                                    <span className="text-gray-900 truncate max-w-[400px] font-mono bg-gray-50 px-3 py-1 rounded">••••••••••••</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-600">OpenAI Key:</span>
                                    <span className="text-gray-900 truncate max-w-[400px] font-mono bg-gray-50 px-3 py-1 rounded">
                                        {formData.aiApiKey ? '••••••••••••' : 'No configurada'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '3rem' }}>
                            <button
                                onClick={handleBack}
                                disabled={stepIndex === 0}
                                className={`btn flex-1 ${stepIndex === 0 ? 'opacity-50 cursor-not-allowed btn-secondary' : 'btn-secondary'}`}
                            >
                                Atrás
                            </button>
                            <button onClick={handleNext} className="btn btn-primary flex-1">
                                {stepIndex === steps.length - 1 ? 'Guardar y Finalizar' : 'Siguiente'}
                            </button>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-base text-gray-500 hover:text-gray-800 hover:bg-gray-200 border border-transparent hover:border-gray-300 transition-all text-center py-3 px-6 rounded-xl"
                        >
                            Omitir configuración por ahora
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
