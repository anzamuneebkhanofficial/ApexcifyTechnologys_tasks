import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata = {
  title: 'Pak Media',
  description: 'A modern social media platform for Pakistan and beyond',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="main-wrapper">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
