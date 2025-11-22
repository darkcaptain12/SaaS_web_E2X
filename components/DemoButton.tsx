'use client'

import { useRouter } from 'next/navigation'
import { Session } from 'next-auth'
import { ExternalLink } from 'lucide-react'

interface DemoButtonProps {
  productSlug: string
  planId: string
  demoUrl: string | null
  session: Session | null
}

export default function DemoButton({ productSlug, planId, demoUrl, session }: DemoButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    // If demo URL exists, open it directly without authentication check
    if (demoUrl) {
      window.open(demoUrl, '_blank', 'noopener,noreferrer')
      return
    }

    // If no demo URL, fallback behavior
    if (!session) {
      // Not authenticated - redirect to auth with callback URL
      const callbackUrl = encodeURIComponent(`/products/${productSlug}?planId=${planId}&demo=true`)
      router.push(`/auth/register?callbackUrl=${callbackUrl}&planId=${planId}`)
      return
    }

    // Authenticated but no demo URL - redirect to product page
    router.push(`/products/${productSlug}?planId=${planId}`)
  }

  return (
    <button
      onClick={handleClick}
      className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3.5 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
    >
      <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span>Demo</span>
    </button>
  )
}

