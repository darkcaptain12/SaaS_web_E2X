'use client'

import AdminTable from '@/components/AdminTable'

type TrialRow = any

export default function TrialsTable({ data }: { data: TrialRow[] }) {
  const columns = [
    {
      header: 'Kullanıcı',
      accessor: (t: any) =>
        t.user?.name
          ? `${t.user.name} (${t.user.email ?? '-'})`
          : t.user?.email ?? '-',
    },
    {
      header: 'Ürün',
      accessor: (t: any) => t.product?.name ?? '-',
    },
    {
      header: 'Başlangıç',
      accessor: (t: any) =>
        t.startDate
          ? new Date(t.startDate).toLocaleDateString('tr-TR')
          : '-',
    },
    {
      header: 'Bitiş',
      accessor: (t: any) =>
        t.endDate ? new Date(t.endDate).toLocaleDateString('tr-TR') : '-',
    },
    {
      header: 'Durum',
      accessor: (t: any) =>
        t.status === 'ACTIVE'
          ? 'Aktif'
          : t.status === 'EXPIRED'
          ? 'Süresi Doldu'
          : t.status ?? '-',
    },
  ]

  return <AdminTable data={data} columns={columns} />
}