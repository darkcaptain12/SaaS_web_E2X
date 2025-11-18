'use client'

import AdminTable from '@/components/AdminTable'

type UserRow = {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  businessName: string | null
  role: string
  createdAt: Date | string
}

export default function UsersTable({ data }: { data: UserRow[] }) {
  return (
    <AdminTable<UserRow>
      data={data}
      columns={[
        {
          header: 'Ad Soyad',
          accessor: (u: UserRow) => u.name ?? '—',
        },
        {
          header: 'E-posta',
          accessor: (u: UserRow) => u.email ?? '—',
        },
        {
          header: 'Telefon',
          accessor: (u: UserRow) => u.phone ?? '—',
        },
        {
          header: 'İşletme',
          accessor: (u: UserRow) => u.businessName ?? '—',
        },
        {
          header: 'Rol',
          accessor: (u: UserRow) =>
            u.role === 'ADMIN' ? 'Yönetici' : 'Kullanıcı',
        },
        {
          header: 'Kayıt Tarihi',
          accessor: (u: UserRow) =>
            new Date(u.createdAt).toLocaleDateString('tr-TR'),
        },
      ]}
    />
  )
}