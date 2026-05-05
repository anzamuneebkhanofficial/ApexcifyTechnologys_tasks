'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function Checkout() {
    const router = useRouter();
    const { cartItems, clearCart } = useCartStore();
    const { user } = useAuthStore();

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('PayPal');
    const [loading, setLoading] = useState(false);

    if (!user) {
        if (typeof window !== 'undefined') router.push('/login?redirect=checkout');
        return null;
    }

    if (cartItems.length === 0) {
        if (typeof window !== 'undefined') router.push('/');
        return null;
    }

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    const placeOrderHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/orders', {
                orderItems: cartItems,
                shippingAddress: { address, city, postalCode, country },
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            });
            clearCart();
            toast.success('Order placed successfully!');
            router.push(`/profile`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error placing order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={placeOrderHandler} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                        <div className="space-y-4">
                            <div>
                                <input required placeholder="Address" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" value={address} onChange={(e) => setAddress(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input required placeholder="City" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" value={city} onChange={(e) => setCity(e.target.value)} />
                                <input required placeholder="Postal Code" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                            </div>
                            <div>
                                <input required placeholder="Country" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" value={country} onChange={(e) => setCountry(e.target.value)} />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Payment Method</h2>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="radio" className="form-radio text-indigo-600 focus:ring-indigo-500 h-5 w-5" name="paymentMethod" value="PayPal" checked={paymentMethod === 'PayPal'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                <span className="text-gray-900 font-medium">PayPal or Credit Card</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full mt-10 py-4 px-6 border border-transparent rounded-xl shadow-md text-lg font-bold text-white ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'} transition-all duration-200`}
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                        <ul className="divide-y divide-gray-100 mb-6 max-h-64 overflow-y-auto">
                            {cartItems.map((item) => (
                                <li key={item.product} className="py-4 flex justify-between">
                                    <span className="text-gray-600 line-clamp-1">{item.qty} x {item.name}</span>
                                    <span className="text-gray-900 font-medium ml-4">${(item.qty * item.price).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="space-y-4 border-t border-gray-100 pt-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Items</span>
                                <span>${itemsPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>${shippingPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax</span>
                                <span>${taxPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-gray-100">
                                <span>Total</span>
                                <span>${totalPrice}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
