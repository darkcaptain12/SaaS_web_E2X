import { prisma } from '@/lib/prisma'
import StatsCards from '@/components/StatsCards'
import { formatCurrency } from '@/lib/utils'
import RecentPaymentsTable from '@/RecentPaymentsTable'
import { TrendingUp, Users, Clock, DollarSign } from 'lucide-react'

async function getAdminStats() {
  const [
    totalUsers,
    activeTrials,
    activeSubscriptions,
    payments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.trial.count({ where: { status: 'ACTIVE' } }),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.subscription.findMany({
      where: { status: 'ACTIVE' },
      include: { plan: true },
    }),
  ])

  // Calculate MRR (Monthly Recurring Revenue)
  const mrr = payments.reduce((sum, sub) => {
    if (sub.plan.billingPeriod === 'MONTHLY') {
      return sum + Number(sub.plan.price)
    } else if (sub.plan.billingPeriod === 'YEARLY') {
      return sum + Number(sub.plan.price) / 12
    }
    return sum
  }, 0)

  const recentPayments = await prisma.payment.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      product: { 
        include: { category: true },
      },
      plan: { select: { name: true } },
    },
  }).then(payments => payments.map(p => ({
    ...p,
    amount: Number(p.amount.toString()),
  })))

  return {
    totalUsers,
    activeTrials,
    activeSubscriptions,
    mrr,
    recentPayments,
  }
}

export default async function AdminPage() {
  const stats = await getAdminStats()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-extrabold mb-2">Yönetim Paneli</h1>
        <p className="text-white/90 text-lg">Sistem genelinde özet bilgiler ve istatistikler</p>
      </div>

      {/* Stats Cards */}
      <StatsCards
        stats={[
          {
            title: 'Toplam Kullanıcı',
            value: stats.totalUsers,
            description: 'Kayıtlı toplam kullanıcı sayısı',
          },
          {
            title: 'Aktif Denemeler',
            value: stats.activeTrials,
            description: 'Devam eden ücretsiz denemeler',
          },
          {
            title: 'Aktif Abonelikler',
            value: stats.activeSubscriptions,
            description: 'Aktif ödeme planları',
          },
          {
            title: 'Aylık Tekrarlayan Gelir',
            value: formatCurrency(stats.mrr),
            description: 'Monthly Recurring Revenue',
          },
        ]}
      />

      {/* Recent Payments */}
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Son Ödemeler</h2>
              <p className="text-sm text-gray-600">En son tamamlanan ödemeler</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <RecentPaymentsTable data={stats.recentPayments} />
        </div>
      </div>
    </div>
  )
}
