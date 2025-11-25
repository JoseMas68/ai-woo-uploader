'use client';

import React, { useRef } from 'react';
import { useSettings } from '../../context/SettingsContext';

export default function DataSettings() {
    const { settings, updateSettings } = useSettings();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        if (!settings) return;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "ai_woo_configuracion.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        alert('✅ Configuración exportada correctamente!');
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                if (json.userId && json.woo && json.ai && json.visual) {
                    const { userId, ...importedSettings } = json;
                    updateSettings(importedSettings);
                    alert('✅ Configuración importada correctamente!');
                } else {
                    alert('⚠️ Formato de archivo inválido.');
                }
            } catch (error) {
                console.error('Error al importar:', error);
                alert('❌ Error al leer el archivo.');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Export Section */}
            <div style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                border: '1px solid #86efac',
                borderRadius: '12px',
                padding: '1.5rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{
                        background: '#22c55e',
                        borderRadius: '10px',
                        padding: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                        <h4 className="label" style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>
                            Exportar Configuración
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#166534', marginBottom: '1rem' }}>
                            Descarga un archivo JSON con toda tu configuración actual (WooCommerce, IA, Visual).
                        </p>
                        <button onClick={handleExport} className="btn btn-primary" style={{ width: '100%' }}>
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Exportar Configuración
                        </button>
                    </div>
                </div>
            </div>

            {/* Import Section */}
            <div style={{
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                border: '1px solid #93c5fd',
                borderRadius: '12px',
                padding: '1.5rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{
                        background: '#3b82f6',
                        borderRadius: '10px',
                        padding: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                        <h4 className="label" style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>
                            Importar Configuración
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#1e40af', marginBottom: '1rem' }}>
                            Sube un archivo JSON exportado previamente para restaurar tu configuración.
                        </p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImportFile}
                            accept=".json"
                            style={{ display: 'none' }}
                        />
                        <button onClick={handleImportClick} className="btn btn-secondary" style={{ width: '100%' }}>
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Importar Configuración
                        </button>
                    </div>
                </div>
            </div>

            {/* Info Note */}
            <div className="alert" style={{ background: '#fef3c7', border: '1px solid #fcd34d', color: '#78350f' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>
                    <strong>Nota:</strong> Importar configuración sobrescribirá tu configuración actual. Asegúrate de exportar primero si quieres guardar una copia de seguridad.
                </p>
            </div>
        </div>
    );
}
