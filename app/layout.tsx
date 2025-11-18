import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'E2X - İş Otomasyon Panelleri',
    template: '%s | E2X',
  },
  description: 'Tüm sektörler için profesyonel otomasyon çözümleri. 3 ana panel ile işletmenizi dijitalleştirin. 7 gün ücretsiz deneme.',
  keywords: ['otomasyon', 'iş otomasyonu', 'restoran otomasyonu', 'yönetim paneli', 'operasyon paneli', 'satış paneli', 'SaaS'],
  authors: [{ name: 'E2X' }],
  creator: 'E2X',
  publisher: 'E2X',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: '/',
    siteName: 'E2X',
    title: 'E2X - İş Otomasyon Panelleri',
    description: 'Tüm sektörler için profesyonel otomasyon çözümleri. 3 ana panel ile işletmenizi dijitalleştirin.',
    images: [
      {
        url: '/logo.svg',
        width: 140,
        height: 140,
        alt: 'E2X Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E2X - İş Otomasyon Panelleri',
    description: 'Tüm sektörler için profesyonel otomasyon çözümleri. 7 gün ücretsiz deneme.',
    images: ['/logo.svg'],
  },
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  )
}

