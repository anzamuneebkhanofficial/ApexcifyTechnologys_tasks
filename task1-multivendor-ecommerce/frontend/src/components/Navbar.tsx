'use client';
import Link from 'next/link';
import { ShoppingCart, User as UserIcon, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const { cartItems } = useCartStore();

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                            LuxeMarket
                        </Link>
                    </div>
                    <div className="flex items-center space-x-6">
                        <Link href="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                            <ShoppingCart className="w-6 h-6" />
                            {cartItems.length > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                                </span>
                            )}
                        </Link>
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link href={user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor' : '/profile'} className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">
                                    <UserIcon className="w-5 h-5" />
                                    <span className="font-medium">{user.name}</span>
                                </Link>
                                <button onClick={logout} className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                                    Log In
                                </Link>
                                <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
