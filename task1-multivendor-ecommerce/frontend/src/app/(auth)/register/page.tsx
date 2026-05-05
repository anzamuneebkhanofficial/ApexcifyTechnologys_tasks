'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setUser } = useAuthStore();

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/users/register', { name, email, password, role });
            setUser(data);
            toast.success('Account created successfully');
            if (data.role === 'admin') router.push('/admin');
            else if (data.role === 'vendor') router.push('/vendor');
            else router.push('/');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                        Create an account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join LuxeMarket as a Customer or Vendor
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={submitHandler}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <input
                                name="name"
                                type="text"
                                required
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
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
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                            >
                                <option value="customer">I want to buy products (Customer)</option>
                                <option value="vendor">I want to sell products (Vendor)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none transition-all duration-200 shadow-md`}
                        >
                            {loading ? 'Creating account...' : 'Sign up'}
                        </button>
                    </div>
                </form>
                <div className="text-center mt-4">
                    <span className="text-gray-600 text-sm">Already have an account? </span>
                    <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
