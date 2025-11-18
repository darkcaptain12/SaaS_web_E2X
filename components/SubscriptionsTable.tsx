'use client'

import AdminTable from '@/components/AdminTable'
import { formatDate, formatCurrency } from '@/lib/utils'

type SubscriptionRow = {
  id: string
  user?: {
    name?: string | null
    email?: string | null
  } | null
  product?: {
    name?: string | null
  } | null
  plan?: {
    name?: string | null
    price?: number | string | null
    currency?: string | null
  } | null
  status: string
  startDate: Date | string
  nextBillingDate?: Date | string | null
}

export default function SubscriptionsTable({
  data,
}: {
  data: SubscriptionRow[]
}) {
  const columns = [
    {
      header: 'Kullanıcı',
      accessor: (s: SubscriptionRow) =>
        s.user?.name
          ? `${s.user.name} (${s.user.email ?? '-'})`
          : s.user?.email ?? '-',
    },
    {
      header: 'Ürün',
      accessor: (s: SubscriptionRow) => s.product?.name ?? '-',
    },
    {
      header: 'Plan',
      accessor: (s: SubscriptionRow) => s.plan?.name ?? '-',
    },
    {
      header: 'Fiyat',
      accessor: (s: SubscriptionRow) =>
        s.plan?.price != null && s.plan?.currency
          ? formatCurrency(Number(s.plan.price), s.plan.currency)
          : '-',
    },
    {
      header: 'Durum',
      accessor: (s: SubscriptionRow) => {
        const styles: Record<string, string> = {
          ACTIVE: 'bg-green-100 text-green-800',
          CANCELLED: 'bg-gray-100 text-gray-800',
          EXPIRED: 'bg-red-100 text-red-800',
          PAST_DUE: 'bg-yellow-100 text-yellow-800',
        }
        const labels: Record<string, string> = {
          ACTIVE: 'Aktif',
          CANCELLED: 'İptal Edildi',
          EXPIRED: 'Süresi Doldu',
          PAST_DUE: 'Gecikmiş',
        }

        return (
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              styles[s.status] ?? ''
            }`}
          >
            {labels[s.status] ?? s.status}
          </span>
        )
      },
    },
    {
      header: 'Başlangıç',
      accessor: (s: SubscriptionRow) => formatDate(s.startDate),
    },
    {
      header: 'Sonraki Ödeme',
      accessor: (s: SubscriptionRow) =>
        s.nextBillingDate ? formatDate(s.nextBillingDate) : '-',
    },
  ]

  return <AdminTable<SubscriptionRow> data={data} columns={columns} />
}