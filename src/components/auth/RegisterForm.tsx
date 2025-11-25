'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const router = useRouter();

    // Clear fields on mount to prevent browser autocomplete
    useEffect(() => {
        setName('');
        setEmail('');
        setPassword('');
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = await register(name, email, password);
        if (success) {
            router.push('/');
        } else {
            setError('Registration failed. Email might be taken.');
        }
    };

    return (
        <div className="w-full max-w-md" style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <div className="message-bubble" style={{ marginBottom: '1.5rem' }}>
                <h2 className="chat-title" style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>
                    Create Account
                </h2>
                <p className="chat-subtitle">Join AI Woo Uploader to get started</p>
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
                        Full Name
                    </label>
                    <div className="input-container">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="chat-input"
                            placeholder="Introduce tu nombre"
                            autoComplete="off"
                            required
                        />
                    </div>
                </div>

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
                            minLength={6}
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    <span>Create Account</span>
                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                </button>
            </form>

            <div className="message-bubble" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.9rem', color: '#718096' }}>
                    Already have an account?{' '}
                    <Link href="/login" style={{ color: 'var(--primary-color, #667eea)', fontWeight: 600, textDecoration: 'none' }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
