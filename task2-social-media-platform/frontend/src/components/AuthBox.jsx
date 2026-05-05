"use client"
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AuthBox() {
    const [username, setUsername] = useState('');
    const { login } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await login(username);
        setLoading(false);
        if (success) {
            router.refresh();
        }
    };

    return (
        <div className="card auth-box">
            <h1>Welcome to <span style={{color: 'var(--accent)'}}>Pak Media</span></h1>
            <p style={{color: 'var(--text-muted)', marginBottom: '20px'}}>Enter your username to begin coding and connecting.</p>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Username..." 
                    value={username} 
                    onChange={e => setUsername(e.target.value)}
                    required
                />
                <button type="submit" className="btn" disabled={loading}>
                    {loading ? <div className="loader"></div> : "Join / Login"}
                </button>
            </form>
        </div>
    );
}
