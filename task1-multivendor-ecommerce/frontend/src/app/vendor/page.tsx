'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VendorDashboard() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'vendor') {
            router.push('/');
            return;
        }
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                const vendorProducts = data.filter((p: any) => p.vendor._id === user._id);
                setProducts(vendorProducts);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [user, router]);

    const createProductHandler = async () => {
        try {
            const { data } = await api.post('/products');
            toast.success('Sample product created. Please edit it.');
            setProducts([...products, data] as any);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error creating product');
        }
    };

    if (!user || user.role !== 'vendor') return null;

    return (
        <div className="py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Vendor Dashboard</h1>
                <button 
                    onClick={createProductHandler}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5 mr-2" /> Create Product
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">ID</th>
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold">Price</th>
                                <th className="p-4 font-semibold">Category</th>
                                <th className="p-4 font-semibold">Stock</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                            {products.map((product: any) => (
                                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-500">{product._id.substring(0, 8)}...</td>
                                    <td className="p-4 font-semibold text-gray-900">{product.name}</td>
                                    <td className="p-4">${product.price}</td>
                                    <td className="p-4">{product.category}</td>
                                    <td className="p-4">{product.countInStock}</td>
                                    <td className="p-4 flex justify-end space-x-3">
                                        <button className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {products.length === 0 && !loading && (
                        <div className="p-8 text-center text-gray-500">You haven't listed any products yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
