'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CancelSubscriptionButtonProps {
  subscriptionId: string
}

export default function CancelSubscriptionButton({ subscriptionId }: CancelSubscriptionButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleCancel = async () => {
    if (!confirm('Aboneliği iptal etmek istediğinizden emin misiniz?')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || 'İptal işlemi başarısız')
      }
    } catch (error) {
      console.error('Cancel subscription error:', error)
      alert('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="text-red-600 hover:text-red-700 disabled:opacity-50"
    >
      {loading ? 'İptal ediliyor...' : 'İptal Et'}
    </button>
  )
}

