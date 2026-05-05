'use client';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import { Trash2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Cart() {
    const { cartItems, removeFromCart } = useCartStore();
    const router = useRouter();

    const checkoutHandler = () => {
        router.push('/login?redirect=checkout');
    };

    return (
        <div className="py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>
            
            {cartItems.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100">
                    <p className="text-gray-600 text-lg mb-6">Your cart is currently empty.</p>
                    <Link href="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <ul className="divide-y divide-gray-100">
                                {cartItems.map((item) => (
                                    <li key={item.product} className="p-6 flex flex-col sm:flex-row items-center hover:bg-gray-50 transition-colors">
                                        <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg mb-4 sm:mb-0" />
                                        <div className="sm:ml-6 flex-1 flex flex-col sm:flex-row justify-between w-full">
                                            <div className="flex flex-col mb-4 sm:mb-0">
                                                <Link href={`/products/${item.product}`} className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1">
                                                    {item.name}
                                                </Link>
                                                <span className="text-indigo-600 font-bold mt-1">${item.price}</span>
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6">
                                                <div className="text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-lg">Qty: {item.qty}</div>
                                                <button 
                                                    onClick={() => removeFromCart(item.product)}
                                                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                                    <span>${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                onClick={checkoutHandler}
                                disabled={cartItems.length === 0}
                                className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-all duration-200"
                            >
                                Proceed to Checkout
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
