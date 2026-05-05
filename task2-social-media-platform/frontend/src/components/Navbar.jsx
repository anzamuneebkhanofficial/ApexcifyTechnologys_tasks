"use client"
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <Link href="/" className="nav-brand">
                    Pak Media
                </Link>
                <div className="nav-links">
                    {user ? (
                        <>
                            <Link href="/">Feed</Link>
                            <Link href={`/profile/${user._id}`}>Profile</Link>
                            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>
                                Logout
                            </button>
                        </>
                    ) : ( null )}
                </div>
            </div>
        </nav>
    );
}
