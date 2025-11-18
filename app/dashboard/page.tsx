import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import StatsCards from '@/components/StatsCards'
import { formatCurrency, calculateRemainingDays } from '@/lib/utils'

async function getDashboardData(userId: string) {
  // Expire trials before fetching (ensures up-to-date status)
  const { expireTrials } = await import('@/lib/trials')
  await expireTrials()

  const [trials, subscriptions, payments] = await Promise.all([
    prisma.trial.findMany({
      where: { userId, status: 'ACTIVE' },
      include: { 
        product: {
          include: { category: true },
        },
      },
      take: 5,
    }),
    prisma.subscription.findMany({
      where: { userId, status: 'ACTIVE' },
      include: { 
        product: {
          include: { category: true },
        },
        plan: true,
      },
      take: 5,
    }),
    prisma.payment.findMany({
      where: {
        userId,
        status: 'SUCCESS',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
  ])

  const activeTrialsCount = trials.length
  const activeSubscriptionsCount = subscriptions.length
  const monthlyPayments = payments.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  )

  return {
    activeTrialsCount,
    activeSubscriptionsCount,
    monthlyPayments,
    trials,
    subscriptions,
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null
  }

  const data = await getDashboardData(session.user.id)

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-extrabold mb-2">
          Hoş geldiniz, {session.user.name}! 👋
        </h1>
        <p className="text-white/90 text-lg">
          {(session.user as any).businessName ? `${(session.user as any).businessName} - ` : ''}
          Hesabınızın genel durumunu buradan takip edebilirsiniz
        </p>
        {session.user.role === 'ADMIN' && (
          <div className="mt-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/30"
            >
              <span>⚙️</span>
              <span>Yönetim Paneline Git</span>
            </Link>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <StatsCards
        stats={[
          {
            title: 'Aktif Denemeler',
            value: data.activeTrialsCount,
            description: 'Devam eden ücretsiz denemeler',
          },
          {
            title: 'Aktif Abonelikler',
            value: data.activeSubscriptionsCount,
            description: 'Aktif ödeme planları',
          },
          {
            title: 'Bu Ay Ödemeler',
            value: formatCurrency(data.monthlyPayments),
            description: 'Bu ay yapılan toplam ödemeler',
          },
        ]}
      />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Trials */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-50 to-orange-50 px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">⏱️</span>
                </div>
                <h2 className="text-xl font-extrabold text-gray-900">Aktif Denemeleriniz</h2>
              </div>
              <Link
                href="/dashboard/trials"
                className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1 group"
              >
                Tümünü Gör
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="p-6">
            {data.trials.length > 0 ? (
              <div className="space-y-4">
                {data.trials.map((trial) => (
                  <div key={trial.id} className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 hover:border-primary-200 transition-colors">
                    <h3 className="font-bold text-gray-900 mb-2">{trial.product.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Kalan süre:</span>
                      <span className="font-bold text-primary-600">{calculateRemainingDays(trial.endDate)} gün</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🎁</div>
                <p className="text-gray-500 font-medium">Aktif deneme bulunmuyor</p>
                <Link
                  href="/products"
                  className="text-primary-600 hover:text-primary-700 font-semibold text-sm mt-2 inline-block"
                >
                  Sistemleri keşfet →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">💳</span>
                </div>
                <h2 className="text-xl font-extrabold text-gray-900">Aktif Abonelikleriniz</h2>
              </div>
              <Link
                href="/dashboard/billing"
                className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1 group"
              >
                Tümünü Gör
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="p-6">
            {data.subscriptions.length > 0 ? (
              <div className="space-y-4">
                {data.subscriptions.map((sub) => (
                  <div key={sub.id} className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 hover:border-primary-200 transition-colors">
                    <h3 className="font-bold text-gray-900 mb-2">{sub.product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{sub.plan.name}</span>
                      <span className="font-bold text-primary-600">{formatCurrency(Number(sub.plan.price), sub.plan.currency)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📦</div>
                <p className="text-gray-500 font-medium">Aktif abonelik bulunmuyor</p>
                <Link
                  href="/products"
                  className="text-primary-600 hover:text-primary-700 font-semibold text-sm mt-2 inline-block"
                >
                  Planları görüntüle →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

