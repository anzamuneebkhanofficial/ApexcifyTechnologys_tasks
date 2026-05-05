'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../lib/axios';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">LuxeMarket</span>
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Discover premium products from top vendors around the world. Shop with confidence.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product: any, index: number) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={product._id}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                    >
                        <Link href={`/products/${product._id}`}>
                            <div className="relative h-64 overflow-hidden bg-gray-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <div className="text-xs font-semibold text-indigo-600 mb-2 uppercase tracking-wider">
                                    {product.category}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                    {product.name}
                                </h3>
                                <div className="flex items-center mb-4">
                                    <div className="flex items-center text-yellow-400">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="ml-1 text-sm font-medium text-gray-600">
                                            {product.rating} ({product.numReviews})
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-2xl font-black text-gray-900">${product.price}</span>
                                    <span className="text-sm text-gray-500 border border-gray-200 px-2 py-1 rounded-md">
                                        {product.vendor?.name || 'Vendor'}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
            {products.length === 0 && (
                <div className="text-center text-gray-500 mt-10 text-lg">No products found.</div>
            )}
        </div>
    );
}
