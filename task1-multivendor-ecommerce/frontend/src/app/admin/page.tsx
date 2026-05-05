'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { Users, Package, ShoppingCart } from 'lucide-react';

export default function AdminDashboard() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            router.push('/');
            return;
        }
        const fetchAdminData = async () => {
            try {
                const [usersRes, productsRes, ordersRes] = await Promise.all([
                    api.get('/users'),
                    api.get('/products'),
                    api.get('/orders')
                ]);
                setStats({
                    users: usersRes.data.length,
                    products: productsRes.data.length,
                    orders: ordersRes.data.length
                });
                setOrders(ordersRes.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchAdminData();
    }, [user, router]);

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-4 bg-indigo-100 text-indigo-600 rounded-xl mr-6">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Users</div>
                        <div className="text-3xl font-bold text-gray-900">{stats.users}</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-4 bg-green-100 text-green-600 rounded-xl mr-6">
                        <Package className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Products</div>
                        <div className="text-3xl font-bold text-gray-900">{stats.products}</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-4 bg-purple-100 text-purple-600 rounded-xl mr-6">
                        <ShoppingCart className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Orders</div>
                        <div className="text-3xl font-bold text-gray-900">{stats.orders}</div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">ID</th>
                                <th className="p-4 font-semibold">User</th>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Total</th>
                                <th className="p-4 font-semibold">Paid</th>
                                <th className="p-4 font-semibold">Delivered</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                            {orders.slice(0, 10).map((order: any) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium">{order._id.substring(0, 8)}...</td>
                                    <td className="p-4">{order.user?.name}</td>
                                    <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 font-bold">${order.totalPrice}</td>
                                    <td className="p-4">
                                        {order.isPaid ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Yes</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">No</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {order.isDelivered ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Yes</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Pending</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
