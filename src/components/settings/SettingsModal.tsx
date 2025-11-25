'use client';

import React, { useState } from 'react';
import WooSettings from './WooSettings';
import AISettings from './AISettings';
import DataSettings from './DataSettings';
import { useSettings } from '../../context/SettingsContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const [activeTab, setActiveTab] = useState<'woo' | 'ai' | 'data'>('woo');
    const { settings } = useSettings();

    if (!isOpen) return null;

    // Use userId as key to force component remount when user changes
    const userKey = settings?.userId || 'no-user';

    return (
        <>
            {/* Overlay oscuro separado */}
            <div
                className="fixed inset-0"
                style={{
                    background: 'rgba(0, 0, 0, 0.85)',
                    zIndex: 9998,
                    animation: 'fadeIn 0.2s ease-out'
                }}
                onClick={onClose}
            />

            {/* Modal por encima del overlay */}
            <div
                className="fixed inset-0 flex items-center justify-center p-4"
                style={{
                    zIndex: 9999,
                    pointerEvents: 'none'
                }}
            >
                <div
                    style={{
                        width: '100%',
                        maxWidth: '48rem',
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '2rem',
                        gap: '1rem',
                        background: '#f7fafc',
                        borderRadius: '16px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
                        animation: 'fadeIn 0.3s ease-out',
                        pointerEvents: 'auto'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div style={{ marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h2 className="chat-title" style={{ marginBottom: '0.25rem', fontSize: '1.5rem' }}>
                                    Configuración
                                </h2>
                                <p className="chat-subtitle">Configura WooCommerce e IA</p>
                            </div>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    color: '#718096',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                    lineHeight: 1,
                                    transition: 'color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#2d3748'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#718096'}
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div style={{ marginBottom: '0.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                            <button
                                className={activeTab === 'woo' ? 'btn btn-primary' : 'btn btn-secondary'}
                                onClick={() => setActiveTab('woo')}
                                style={{ fontSize: '0.875rem', padding: '0.75rem 1rem' }}
                            >
                                🛒 WooCommerce
                            </button>
                            <button
                                className={activeTab === 'ai' ? 'btn btn-primary' : 'btn btn-secondary'}
                                onClick={() => setActiveTab('ai')}
                                style={{ fontSize: '0.875rem', padding: '0.75rem 1rem' }}
                            >
                                🤖 IA
                            </button>
                            <button
                                className={activeTab === 'data' ? 'btn btn-primary' : 'btn btn-secondary'}
                                onClick={() => setActiveTab('data')}
                                style={{ fontSize: '0.875rem', padding: '0.75rem 1rem' }}
                            >
                                💾 Datos
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            maxHeight: 'calc(90vh - 250px)',
                            padding: '1.5rem',
                            background: 'white',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0'
                        }}
                    >
                        {activeTab === 'woo' && <WooSettings key={`woo-${userKey}`} />}
                        {activeTab === 'ai' && <AISettings key={`ai-${userKey}`} />}
                        {activeTab === 'data' && <DataSettings key={`data-${userKey}`} />}
                    </div>
                </div>
            </div>
        </>
    );
}
