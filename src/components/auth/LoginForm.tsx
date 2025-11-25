'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    // Clear fields on mount to prevent browser autocomplete
    useEffect(() => {
        setEmail('');
        setPassword('');
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = await login(email, password);
        if (success) {
            router.push('/');
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="w-full max-w-md" style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <div className="message-bubble" style={{ marginBottom: '1.5rem' }}>
                <h2 className="chat-title" style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>
                    Welcome Back
                </h2>
                <p className="chat-subtitle">Sign in to continue to AI Woo Uploader</p>
            </div>

            {error && (
                <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                    <svg className="icon-alert" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="message-bubble">
                    <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                        Email Address
                    </label>
                    <div className="input-container">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="chat-input"
                            placeholder="Introduce tu email"
                            autoComplete="off"
                            required
                        />
                    </div>
                </div>

                <div className="message-bubble">
                    <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                        Password
                    </label>
                    <div className="input-container">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="chat-input"
                            placeholder="Introduce tu contraseña"
                            autoComplete="off"
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    <span>Sign In</span>
                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </form>

            <div className="message-bubble" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.9rem', color: '#718096' }}>
                    Don't have an account?{' '}
                    <Link href="/register" style={{ color: 'var(--primary-color, #667eea)', fontWeight: 600, textDecoration: 'none' }}>
                        Create one now
                    </Link>
                </p>
            </div>
        </div>
    );
}
