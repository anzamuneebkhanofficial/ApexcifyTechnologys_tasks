'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { User, Package, Settings } from 'lucide-react';

export default function Profile() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user, router]);

    if (!user) return null;

    return (
        <div className="py-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Profile</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center sticky top-24">
                        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                            <User className="w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
                        <p className="text-gray-500 mb-4">{user.email}</p>
                        <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
                            {user.role}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center space-x-3">
                            <Package className="w-6 h-6 text-indigo-600" />
                            <h2 className="text-xl font-bold text-gray-900">My Orders</h2>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="animate-pulse space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
                                    ))}
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">You haven't placed any orders yet.</div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order: any) => (
                                        <div key={order._id} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                                            <div className="flex flex-wrap justify-between items-start md:items-center gap-4 mb-4">
                                                <div>
                                                    <div className="text-sm text-gray-500 mb-1">Order #{order._id}</div>
                                                    <div className="text-gray-900 font-semibold">{new Date(order.createdAt).toLocaleDateString()}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xl font-bold text-indigo-600">${order.totalPrice}</div>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-50">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-500">Payment:</span>
                                                    {order.isPaid ? (
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Paid</span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Not Paid</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-500">Delivery:</span>
                                                    {order.isDelivered ? (
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Delivered</span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Processing</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
