import PricingTable from '@/components/PricingTable'
import { prisma } from '@/lib/prisma'

async function getPlans() {
  try {
    return await prisma.plan.findMany({
      where: { isActive: true },
      include: { 
        product: {
          include: { category: true },
        },
      },
      orderBy: { price: 'asc' },
    })
  } catch (error) {
    console.error('Error fetching plans:', error)
    return []
  }
}

export default async function PricingPage() {
  const plans = await getPlans()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
              <span>✨</span>
              <span>7 Gün Ücretsiz Deneme</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Fiyatlandırma
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              3 Profesyonel Panel için esnek fiyatlandırma. Her panelde 7 gün ücretsiz deneme fırsatı.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {plans.length > 0 ? (
          <PricingTable plans={plans} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Fiyatlandırma planları yakında eklenecek.</p>
          </div>
        )}

        <div className="mt-16 bg-gradient-to-br from-primary-50 to-orange-50 rounded-2xl shadow-soft border border-primary-100 p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-5xl mb-6">💼</div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Özel Paket İhtiyacınız mı Var?</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Birden fazla sistem veya özel gereksinimleriniz için bizimle iletişime geçin. 
              Size özel çözümler sunuyoruz.
            </p>
            <div className="flex items-center justify-center gap-2 text-primary-600 font-semibold">
              <span>💬</span>
              <span>WhatsApp butonunu kullanarak 7/24 destek alabilirsiniz</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

