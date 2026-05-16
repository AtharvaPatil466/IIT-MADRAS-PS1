import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'DriveLegal — Your Legal Driving Assistant',
  description: 'Know your traffic rights, calculate challans, and verify fines instantly.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`} style={{ background: 'var(--background)', color: 'var(--on-background)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* ── Header ── */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(11, 19, 38, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 1px 24px rgba(37,99,235,0.08)',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
              <div style={{
                width: '36px', height: '36px',
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.75rem', color: 'white', letterSpacing: '0.05em',
                boxShadow: '0 0 14px rgba(37,99,235,0.45)',
              }}>
                DL
              </div>
              <span style={{ fontWeight: 700, fontSize: '1.125rem', letterSpacing: '-0.02em', color: 'var(--on-background)' }}>
                DriveLegal
              </span>
            </Link>

            {/* Location pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.375rem 0.875rem',
              background: 'rgba(37,99,235,0.12)',
              border: '1px solid rgba(37,99,235,0.25)',
              borderRadius: '9999px',
              fontSize: '0.8125rem', fontWeight: 500, color: 'var(--primary)',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
              <MapPin style={{ width: '13px', height: '13px', opacity: 0.7 }} />
              <span>Chennai, India</span>
            </div>

          </div>
        </header>

        {/* ── Navigation ── */}
        <Navigation />

        {/* ── Page content ── */}
        <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem' }}>
          {children}
        </main>

      </body>
    </html>
  )
}
