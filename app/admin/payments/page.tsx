import { prisma } from '@/lib/prisma'
import PaymentsTable from '@/components/PaymentsTable'

async function getPayments() {
  const payments = await prisma.payment.findMany({
    include: {
      user: { select: { name: true, email: true } },
      product: { 
        include: { category: true },
      },
      plan: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  
  // Convert Decimal to string for compatibility
  return payments.map(payment => ({
    ...payment,
    amount: payment.amount.toString(),
  }))
}

export default async function AdminPaymentsPage() {
  const payments = await getPayments()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Ödemeler</h1>

      <PaymentsTable data={payments} />
    </div>
  )
}
