import { prisma } from '@/lib/prisma'
import UsersTable from '@/components/UsersTable'

async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export default async function AdminUsersPage() {
  const users = await getUsers()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kullanıcılar</h1>
      </div>

      <UsersTable data={users} />
    </div>
  )
}
