import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'DriveLegal',
  description: 'Your legal driving assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Left side */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center font-bold rounded shadow-sm">
                DL
              </div>
              <span className="font-semibold text-lg tracking-tight">DriveLegal</span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <MapPin className="w-3.5 h-3.5 text-gray-500" />
              <span>Chennai, India</span>
            </div>
          </div>
        </header>

        {/* Navigation links for easy access to routes */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 flex gap-4 py-2 text-sm">
            <Link href="/" className="text-blue-600 hover:underline">Chat</Link>
            <Link href="/calculator" className="text-blue-600 hover:underline">Calculator</Link>
            <Link href="/rights" className="text-blue-600 hover:underline">Rights</Link>
            <Link href="/verify" className="text-blue-600 hover:underline">Verify Scam</Link>
          </div>
        </nav>

        <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
