'use client'

import { useRouter } from 'next/navigation'
import { Session } from 'next-auth'
import { ShoppingCart, ArrowRight } from 'lucide-react'

interface BuyNowButtonProps {
  productId: string
  planId: string
  session: Session | null
}

export default function BuyNowButton({ productId, planId, session }: BuyNowButtonProps) {
  const router = useRouter()

  const handleClick = async () => {
    if (!session) {
      router.push(`/auth/register?productId=${productId}&planId=${planId}&buy=true`)
      return
    }

    router.push(`/dashboard/billing/pay?productId=${productId}&planId=${planId}`)
  }

  return (
    <button
      onClick={handleClick}
      className="w-full bg-white text-gray-700 px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 border-2 border-gray-200 hover:border-primary-300 hover:text-primary-700 shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
    >
      <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span>Şimdi Satın Al</span>
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </button>
  )
}

