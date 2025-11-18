'use client'

import AdminTable from '@/components/AdminTable'
import { formatDate, formatCurrency } from '@/lib/utils'

type PaymentRow = {
  id: string
  createdAt: Date | string
  user?: {
    name?: string | null
    email?: string | null
  } | null
  product?: {
    name?: string | null
  } | null
  plan?: {
    name?: string | null
  } | null
  amount: number | string
  currency: string
  status: string
  paytrTransactionId?: string | null
}

export default function PaymentsTable({ data }: { data: PaymentRow[] }) {
  const columns = [
    {
      header: 'Tarih',
      accessor: (p: PaymentRow) => formatDate(p.createdAt),
    },
    {
      header: 'Kullanıcı',
      accessor: (p: PaymentRow) =>
        p.user?.name
          ? `${p.user.name} (${p.user.email ?? '-'})`
          : p.user?.email ?? '-',
    },
    {
      header: 'Ürün',
      accessor: (p: PaymentRow) => p.product?.name ?? '-',
    },
    {
      header: 'Plan',
      accessor: (p: PaymentRow) => p.plan?.name ?? '-',
    },
    {
      header: 'Tutar',
      accessor: (p: PaymentRow) =>
        formatCurrency(Number(p.amount), p.currency),
    },
    {
      header: 'Durum',
      accessor: (p: PaymentRow) => {
        const styles: Record<string, string> = {
          SUCCESS: 'bg-green-100 text-green-800',
          PENDING: 'bg-yellow-100 text-yellow-800',
          FAILED: 'bg-red-100 text-red-800',
        }
        const labels: Record<string, string> = {
          SUCCESS: 'Başarılı',
          PENDING: 'Beklemede',
          FAILED: 'Başarısız',
        }

        return (
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              styles[p.status] ?? ''
            }`}
          >
            {labels[p.status] ?? p.status}
          </span>
        )
      },
    },
    {
      header: 'PayTR ID',
      accessor: (p: PaymentRow) => p.paytrTransactionId || '-',
    },
  ]

  return <AdminTable<PaymentRow> data={data} columns={columns} />
}