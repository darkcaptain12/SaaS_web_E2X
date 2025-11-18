'use client'

import AdminTable from '@/components/AdminTable'
import { formatCurrency, formatDate } from '@/lib/utils'

type PaymentRow = {
  id: string 
  createdAt: Date | string
  user: { name: string | null; email: string | null }
  product: { name: string }
  plan: { name: string }
  amount: number | string
  currency: string
  status: string
}

export default function RecentPaymentsTable({ data }: { data: PaymentRow[] }) {
  return (
    <AdminTable
      data={data}
      columns={[
        {
          header: 'Tarih',
          accessor: (p: PaymentRow) => formatDate(p.createdAt),
        },
        {
          header: 'Kullanıcı',
          accessor: (p: PaymentRow) => (
            <div>
              <div className="font-semibold text-gray-900">{p.user.name}</div>
              <div className="text-sm text-gray-500">{p.user.email}</div>
            </div>
          ),
        },
        {
          header: 'Ürün',
          accessor: (p: PaymentRow) => (
            <span className="font-medium text-gray-900">{p.product.name}</span>
          ),
        },
        {
          header: 'Plan',
          accessor: (p: PaymentRow) => (
            <span className="text-gray-700">{p.plan.name}</span>
          ),
        },
        {
          header: 'Tutar',
          accessor: (p: PaymentRow) => (
            <span className="font-bold text-gray-900">
              {formatCurrency(Number(p.amount), p.currency)}
            </span>
          ),
        },
        {
          header: 'Durum',
          accessor: (p: PaymentRow) => (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                p.status === 'SUCCESS'
                  ? 'bg-green-100 text-green-800'
                  : p.status === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {p.status === 'SUCCESS'
                ? '✓ Başarılı'
                : p.status === 'PENDING'
                ? '⏳ Beklemede'
                : '✗ Başarısız'}
            </span>
          ),
        },
      ]}
    />
  )
}