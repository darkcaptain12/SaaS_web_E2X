'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'

const userMenuItems = [
  { href: '/dashboard', label: 'Genel Bakış' },
  { href: '/dashboard/trials', label: 'Denemelerim' },
  { href: '/dashboard/billing', label: 'Faturalama' },
]

const adminMenuItems = [
  { href: '/admin', label: 'Genel Bakış' },
  { href: '/admin/settings', label: 'Tasarım Ayarları' },
  { href: '/admin/users', label: 'Kullanıcılar' },
  { href: '/admin/categories', label: 'Kategoriler' },
  { href: '/admin/products', label: 'Ürünler' },
  { href: '/admin/trials', label: 'Denemeler' },
  { href: '/admin/subscriptions', label: 'Abonelikler' },
  { href: '/admin/payments', label: 'Ödemeler' },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'
  const isAdminRoute = pathname?.startsWith('/admin')
  const menuItems = isAdminRoute ? adminMenuItems : userMenuItems

  const menuIcons: Record<string, string> = {
    'Genel Bakış': '📊',
    'Tasarım Ayarları': '🎨',
    'Denemelerim': '⏱️',
    'Faturalama': '💳',
    'Kullanıcılar': '👥',
    'Kategoriler': '📁',
    'Ürünler': '📦',
    'Denemeler': '🎁',
    'Abonelikler': '📋',
    'Ödemeler': '💰',
  }

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen border-r border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-xl">⚙️</span>
          </div>
          <div>
            <h2 className="text-lg font-extrabold">
              {isAdminRoute ? 'Yönetim' : 'Panel'}
            </h2>
            <p className="text-xs text-gray-400">
              {isAdminRoute ? 'Admin Panel' : 'Kullanıcı Panel'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
              pathname === item.href
                ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            )}
          >
            <span className="text-xl">{menuIcons[item.label] || '📄'}</span>
            <span className="font-medium">{item.label}</span>
            {pathname === item.href && (
              <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

