import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatCurrency, calculateRemainingDays } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import StartTrialButton from '@/components/StartTrialButton'
import BuyNowButton from '@/components/BuyNowButton'
import DemoButton from '@/components/DemoButton'
import DemoRedirectHandler from '@/components/DemoRedirectHandler'

async function getProduct(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        plans: {
          where: { isActive: true },
          orderBy: [
            { tier: 'asc' }, // Order by tier: BASIC, PROFESSIONAL, PREMIUM
            { price: 'asc' },
          ],
        },
      },
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { startTrial?: string; demo?: string; planId?: string }
}) {
  const product = await getProduct(params.slug)
  const session = await getServerSession(authOptions)

  if (!product) {
    notFound()
  }

  const minPrice = product.plans.length > 0
    ? Math.min(...product.plans.map((p) => Number(p.price)))
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
          {/* Hero Section */}
          <div className={`relative bg-gradient-to-br ${
            product.category?.color || 'from-primary-600 via-primary-500 to-primary-700'
          } text-white py-20 overflow-hidden`}>
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-bold mb-6 border-2 border-white/30 shadow-lg">
              <span className="text-lg">✨</span>
              <span>{product.trialDays} Gün Ücretsiz Deneme</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg">{product.name}</h1>
            <p className="text-xl md:text-2xl text-white/95 leading-relaxed mb-8 font-light">{product.shortDescription}</p>
            {minPrice > 0 && (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20 inline-flex">
                <span className="text-3xl font-extrabold">{formatCurrency(minPrice)}</span>
                <span className="text-lg font-medium">/ay'dan başlayan fiyatlarla</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <DemoRedirectHandler 
          plans={product.plans.map(p => ({ id: p.id, demoUrl: p.demoUrl }))} 
          demo={searchParams.demo}
          planId={searchParams.planId}
        />
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 md:p-12 mb-8">

          {/* Demo Credentials */}
          {product.demoUrl && (
            <div className="bg-gradient-to-br from-primary-50 to-orange-50 border-2 border-primary-200 rounded-2xl p-8 mb-8 shadow-soft">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900">Canlı Demo</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {product.demoUsername && (
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <span className="text-sm font-semibold text-gray-600 block mb-2">Kullanıcı Adı</span>
                    <code className="text-lg font-mono font-bold text-gray-900">{product.demoUsername}</code>
                  </div>
                )}
                {product.demoPassword && (
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <span className="text-sm font-semibold text-gray-600 block mb-2">Şifre</span>
                    <code className="text-lg font-mono font-bold text-gray-900">{product.demoPassword}</code>
                  </div>
                )}
              </div>
              <a
                href={product.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg"
              >
                Canlı Demo'yu Aç
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}

          {/* Description */}
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Sistem Özellikleri</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>

          {/* Technical Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:border-primary-200 transition-colors">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>📁</span>
                Kategori
              </h3>
              <p className="text-gray-700 font-semibold flex items-center gap-2">
                <span>{product.category?.icon}</span>
                <span>{product.category?.name || 'Kategori Yok'}</span>
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-orange-50 p-6 rounded-xl border-2 border-primary-200">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>⏱️</span>
                Deneme Süresi
              </h3>
              <p className="text-primary-700 font-bold text-lg">{product.trialDays} gün ücretsiz</p>
            </div>
          </div>

          {/* Plans */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Fiyatlandırma Planları</h2>
            {product.plans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {product.plans.map((plan, index) => {
                  const isPopular = plan.tier === 'PROFESSIONAL'
                  // Handle features - can be object with 'features' array or direct array
                  let features: string[] = []
                  if (plan.features) {
                    if (typeof plan.features === 'object' && 'features' in plan.features) {
                      features = (plan.features as { features: string[] }).features || []
                    } else if (Array.isArray(plan.features)) {
                      features = plan.features
                    }
                  }
                  
                  return (
                    <div
                      key={plan.id}
                      className={`relative rounded-2xl p-8 border-2 transition-all duration-300 ${
                        isPopular
                          ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-white shadow-xl scale-105'
                          : 'border-gray-200 bg-white hover:border-primary-200 shadow-soft hover:shadow-lg'
                      }`}
                    >
                      {isPopular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-1 rounded-full text-xs font-bold">
                          POPÜLER
                        </div>
                      )}
                      <div className={`absolute top-0 left-0 w-full h-1 rounded-t-2xl ${
                        isPopular
                          ? 'bg-gradient-to-r from-primary-500 via-orange-500 to-primary-600'
                          : 'bg-gradient-to-r from-primary-400 to-primary-500'
                      }`}></div>
                      <div className="mt-4">
                        <h3 className="text-2xl font-extrabold text-gray-900 mb-2">{plan.name}</h3>
                        <div className="mb-4">
                          <span className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                            {formatCurrency(Number(plan.price), plan.currency)}
                          </span>
                          <span className="text-gray-600 ml-2">
                            {plan.billingPeriod === 'MONTHLY' && '/ay'}
                            {plan.billingPeriod === 'YEARLY' && '/yıl'}
                            {plan.billingPeriod === 'LIFETIME' && ' (tek seferlik)'}
                          </span>
                        </div>
                        {plan.description && (
                          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{plan.description}</p>
                        )}
                        
                        {/* Features List */}
                        {features.length > 0 && (
                          <div className="mb-6">
                            <ul className="space-y-2">
                              {features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <span className="text-primary-600 mt-1">✓</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="space-y-3">
                          <DemoButton
                            productSlug={product.slug}
                            planId={plan.id}
                            demoUrl={plan.demoUrl}
                            session={session}
                          />
                          <StartTrialButton
                            productId={product.id}
                            planId={plan.id}
                            session={session}
                          />
                          <BuyNowButton
                            productId={product.id}
                            planId={plan.id}
                            session={session}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 text-center">
                <p className="text-yellow-800 font-semibold">
                  Bu ürün için henüz fiyatlandırma planı bulunmamaktadır. Lütfen daha sonra tekrar kontrol edin.
                </p>
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            {minPrice > 0 && (
              <p className="text-gray-600 self-center">
                <strong>{formatCurrency(minPrice)}</strong> /ay'dan başlayan fiyatlarla
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

