'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import api from '@/lib/axios';
import { Star, ShoppingCart, ArrowLeft, Truck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProductDetails() {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCartStore();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${params.id}`);
                setProduct(data);
            } catch (error) {
                toast.error('Failed to load product');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [params.id]);

    const addToCartHandler = () => {
        addToCart({
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            qty,
            vendor: product.vendor._id,
        });
        toast.success('Added to cart');
        router.push('/cart');
    };

    if (loading) return <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
    if (!product) return <div className="text-center mt-20 text-xl font-medium">Product not found</div>;

    return (
        <div className="py-6">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-8 transition-colors font-medium">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Catalog
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img src={product.image} alt={product.name} className="w-full max-h-[500px] object-cover hover:scale-105 transition-transform duration-500" />
                </div>

                <div className="flex flex-col">
                    <div className="mb-2 text-indigo-600 font-semibold tracking-wider uppercase text-sm">{product.brand}</div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{product.name}</h1>
                    
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="flex items-center text-yellow-400 bg-yellow-50 px-3 py-1 rounded-full">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="ml-1.5 font-bold text-gray-900">{product.rating}</span>
                        </div>
                        <span className="text-gray-500 text-sm">{product.numReviews} Reviews</span>
                    </div>

                    <div className="text-4xl font-black text-gray-900 mb-8">${product.price}</div>

                    <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

                    <div className="flex items-center space-x-6 mb-8 py-6 border-y border-gray-100">
                        <div className="flex items-center text-gray-600">
                            <Truck className="w-5 h-5 mr-2 text-indigo-600" />
                            <span className="text-sm font-medium">Fast Delivery</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <ShieldCheck className="w-5 h-5 mr-2 text-green-600" />
                            <span className="text-sm font-medium">Secure Checkout</span>
                        </div>
                    </div>

                    <div className="mt-auto bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-gray-700">Status</span>
                            <span className={`font-bold px-3 py-1 rounded-full text-sm ${product.countInStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>

                        {product.countInStock > 0 && (
                            <div className="flex items-center justify-between mb-6">
                                <span className="font-semibold text-gray-700">Quantity</span>
                                <select 
                                    className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 font-medium cursor-pointer"
                                    value={qty} 
                                    onChange={(e) => setQty(Number(e.target.value))}
                                >
                                    {[...Array(product.countInStock).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button 
                            onClick={addToCartHandler}
                            disabled={product.countInStock === 0}
                            className={`w-full flex justify-center items-center py-4 px-6 rounded-xl font-bold text-white transition-all duration-200 ${
                                product.countInStock === 0 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                            }`}
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
