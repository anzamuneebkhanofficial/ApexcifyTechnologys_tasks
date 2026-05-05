import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'LuxeMarket - Multi-Vendor eCommerce',
    description: 'Premium multi-vendor eCommerce platform',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-gray-50 min-h-screen pt-16 text-gray-900`}>
                <Navbar />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>
                <Toaster position="bottom-right" />
            </body>
        </html>
    );
}
