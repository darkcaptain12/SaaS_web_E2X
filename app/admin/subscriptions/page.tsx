import { prisma } from '@/lib/prisma'
import SubscriptionsTable from '@/components/SubscriptionsTable'

async function getSubscriptions() {
  const subscriptions = await prisma.subscription.findMany({
    include: {
      user: { select: { name: true, email: true } },
      product: { 
        include: { category: true },
      },
      plan: { select: { name: true, price: true, currency: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  
  // Convert Decimal to string for compatibility
  return subscriptions.map(subscription => ({
    ...subscription,
    plan: subscription.plan ? {
      ...subscription.plan,
      price: subscription.plan.price.toString(),
    } : null,
  }))
}

export default async function AdminSubscriptionsPage() {
  const subscriptions = await getSubscriptions()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Abonelikler</h1>

      <SubscriptionsTable data={subscriptions} />
    </div>
  )
}
