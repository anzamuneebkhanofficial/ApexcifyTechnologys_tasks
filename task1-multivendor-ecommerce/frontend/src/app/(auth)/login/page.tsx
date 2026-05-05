'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setUser } = useAuthStore();

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/users/login', { email, password });
            setUser(data);
            toast.success('Logged in successfully');
            if (data.role === 'admin') router.push('/admin');
            else if (data.role === 'vendor') router.push('/vendor');
            else router.push('/');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sign in to access your LuxeMarket account
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={submitHandler}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none transition-all duration-200 shadow-md`}
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
                <div className="text-center mt-4">
                    <span className="text-gray-600 text-sm">Don't have an account? </span>
                    <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                        Sign up now
                    </Link>
                </div>
            </div>
        </div>
    );
}
