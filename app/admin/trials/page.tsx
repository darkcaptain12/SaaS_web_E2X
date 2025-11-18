import { prisma } from '@/lib/prisma'
import { expireTrials } from '@/lib/trials'
import TrialsTable from '@/components/TrialsTable'

async function getTrials() {
  // Expire trials before fetching (ensures up-to-date status)
  await expireTrials()

  return await prisma.trial.findMany({
    include: {
      user: { select: { name: true, email: true } },
      product: { 
        include: { category: true },
      },
      plan: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function AdminTrialsPage() {
  const trials = await getTrials()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Denemeler</h1>

      <TrialsTable data={trials} />
    </div>
  )
}
