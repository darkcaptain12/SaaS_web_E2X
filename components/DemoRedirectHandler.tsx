'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface DemoRedirectHandlerProps {
  plans: Array<{ id: string; demoUrl: string | null }>
  demo?: string | null
  planId?: string | null
}

export default function DemoRedirectHandler({ plans, demo, planId }: DemoRedirectHandlerProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [hasOpened, setHasOpened] = useState(false)

  useEffect(() => {
    // Only run if user is authenticated and demo parameter is present
    if (status === 'authenticated' && session && demo === 'true' && planId && !hasOpened) {
      const plan = plans.find((p) => p.id === planId)
      
      if (plan && plan.demoUrl) {
        // Open demo URL in new tab
        window.open(plan.demoUrl, '_blank', 'noopener,noreferrer')
        setHasOpened(true)
        
        // Remove demo parameter from URL
        const url = new URL(window.location.href)
        url.searchParams.delete('demo')
        url.searchParams.delete('planId')
        router.replace(url.pathname + (url.search ? url.search : ''))
      }
    }
  }, [status, session, demo, planId, plans, router, hasOpened])

  return null
}

