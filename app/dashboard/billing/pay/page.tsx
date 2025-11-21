'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function PayPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [paymentUrl, setPaymentUrl] = useState('')
  const [error, setError] = useState('')
  const hasInitiatedRef = useRef(false)

  const productId = searchParams.get('productId')
  const planId = searchParams.get('planId')

  useEffect(() => {
    // Oturum yoksa giriş sayfasına yönlendir
    if (!session) {
      router.push('/auth/login')
      return
    }

    // URL parametreleri eksikse hata göster
    if (!productId || !planId) {
      setError('Ürün veya plan bilgisi eksik')
      setLoading(false)
      return
    }

    // Aynı sayfa tekrar render olsa bile ödemeyi sadece 1 kez başlat
    if (hasInitiatedRef.current) {
      return
    }
    hasInitiatedRef.current = true

    const initiatePayment = async () => {
      try {
        const response = await fetch('/api/paytr/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, planId }),
        })

        const data = await response.json()

        if (response.ok && data.paymentUrl) {
          setPaymentUrl(data.paymentUrl)
        } else {
          setError(data.error || 'Ödeme başlatılamadı')
        }
      } catch (error) {
        console.error('Payment initiation error:', error)
        setError('Bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    initiatePayment()
  }, [session, productId, planId, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p>Ödeme hazırlanıyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            Geri Dön
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Ödeme İşlemi</h1>
        <p className="text-gray-600 mb-6">
          Lütfen bu pencereyi kapatmayın. Ödeme işlemi tamamlandıktan sonra yönlendirileceksiniz.
        </p>
        {paymentUrl ? (
          <iframe
            src={paymentUrl}
            className="w-full h-96 border border-gray-300 rounded-lg"
            title="PayTR Payment"
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Ödeme sayfası yükleniyor...</p>
          </div>
        )}
      </div>
    </div>
  )
}
