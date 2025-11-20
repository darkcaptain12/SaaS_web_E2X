'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function RegisterPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    businessName: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const productId = searchParams.get('productId')
  const startTrial = searchParams.get('startTrial') === 'true'
  const planId = searchParams.get('planId')
  const buy = searchParams.get('buy') === 'true'
  const callbackUrl = searchParams.get('callbackUrl')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Kayıt başarısız')
        setLoading(false)
        return
      }

      // Kayıt sonrası otomatik giriş
      const loginResponse = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      if (loginResponse.ok) {
        // Handle callbackUrl first (for demo redirects)
        if (callbackUrl) {
          router.push(decodeURIComponent(callbackUrl))
          return
        }
        
        if (startTrial && productId) {
          router.push(
            `/api/trials/start?productId=${productId}${
              planId ? `&planId=${planId}` : ''
            }`,
          )
        } else if (buy && productId && planId) {
          router.push(
            `/dashboard/billing/pay?productId=${productId}&planId=${planId}`,
          )
        } else {
          router.push('/dashboard')
        }
      } else {
        router.push('/auth/login')
      }
    } catch (error) {
      setError('Bir hata oluştu')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">✨</span>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
            Hesap Oluşturun
          </h2>
          <p className="text-gray-600">
            Ücretsiz denemeye başlamak için kayıt olun
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Ad Soyad <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder-gray-400"
                  placeholder="Adınız ve soyadınız"
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Adresi <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder-gray-400"
                  placeholder="ornek@email.com"
                  value={formData.email}
                  onChange={e =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Şifre <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder-gray-400"
                  placeholder="En az 6 karakter"
                  value={formData.password}
                  onChange={e =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Telefon
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder-gray-400"
                  placeholder="+90 5XX XXX XX XX"
                  value={formData.phone}
                  onChange={e =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="businessName"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  İşletme Adı
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder-gray-400"
                  placeholder="İşletmenizin adı (opsiyonel)"
                  value={formData.businessName}
                  onChange={e =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3.5 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Kayıt yapılıyor...</span>
                  </>
                ) : (
                  <>
                    <span>Hesap Oluştur</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Zaten hesabınız var mı?{' '}
              <Link
                href="/auth/login"
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Giriş yapın
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterPageInner />
    </Suspense>
  )
}
