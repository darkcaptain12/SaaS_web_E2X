'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

interface Settings {
  siteName?: string
  logoText?: string | null
  logoUrl?: string | null
}

export default function NavbarClient({ settings }: { settings: Settings }) {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const siteName = settings?.siteName || 'İş Otomasyon'
  const logoText = settings?.logoText || siteName
  const logoUrl = settings?.logoUrl

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              {logoUrl ? (
                <Image 
                  src={logoUrl} 
                  alt={siteName} 
                  width={40}
                  height={40}
                  className="h-10 w-auto transition-transform group-hover:scale-105"
                  unoptimized
                />
              ) : (
                <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:via-pink-700 group-hover:to-orange-700 transition-all">
                  {logoText || 'E2X'}
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/products" className="text-gray-700 hover:text-primary-600 px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-50">
              Paneller
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-primary-600 px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-50">
              Fiyatlandırma
            </Link>
            {status === 'authenticated' ? (
              <>
                {session?.user?.role === 'ADMIN' && (
                  <Link href="/admin" className="text-gray-700 hover:text-primary-600 px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-50">
                    Yönetim
                  </Link>
                )}
                <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-50">
                  Panel
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-primary-600 px-4 py-2 rounded-lg font-medium transition-all hover:bg-gray-100"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-700 hover:text-primary-600 px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-50">
                  Giriş
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg hover:scale-105"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link href="/products" className="block text-gray-700 hover:text-primary-600">
              Sistemler
            </Link>
            <Link href="/pricing" className="block text-gray-700 hover:text-primary-600">
              Fiyatlandırma
            </Link>
            {status === 'authenticated' ? (
              <>
                {session?.user?.role === 'ADMIN' && (
                  <Link href="/admin" className="block text-gray-700 hover:text-primary-600">
                    Yönetim
                  </Link>
                )}
                <Link href="/dashboard" className="block text-gray-700 hover:text-primary-600">
                  Panel
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block text-gray-700 hover:text-primary-600 w-full text-left"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block text-gray-700 hover:text-primary-600">
                  Giriş
                </Link>
                <Link
                  href="/auth/register"
                  className="block bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 text-center"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

