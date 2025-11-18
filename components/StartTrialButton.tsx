'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Session } from 'next-auth'
import { Sparkles, Loader2 } from 'lucide-react'

interface StartTrialButtonProps {
  productId: string
  planId?: string
  session: Session | null
}

export default function StartTrialButton({ productId, planId, session }: StartTrialButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (!session) {
      router.push(`/auth/register?productId=${productId}&startTrial=true${planId ? `&planId=${planId}` : ''}`)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/trials/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, planId }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/dashboard/trials?success=true')
      } else {
        alert(data.error || 'Deneme başlatılamadı')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error starting trial:', error)
      alert('Bir hata oluştu')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3.5 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Başlatılıyor...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>7 Gün Ücretsiz Dene</span>
        </>
      )}
    </button>
  )
}

