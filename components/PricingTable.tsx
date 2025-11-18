'use client'

import Link from 'next/link'
import { Plan, Product } from '@prisma/client'
import { formatCurrency } from '@/lib/utils'
import { ArrowRight, Sparkles, Check } from 'lucide-react'

interface PricingTableProps {
  plans: (Plan & { product: Product })[]
}

export default function PricingTable({ plans }: PricingTableProps) {
  const groupedPlans = plans.reduce((acc, plan) => {
    if (!acc[plan.productId]) {
      acc[plan.productId] = []
    }
    acc[plan.productId].push(plan)
    return acc
  }, {} as Record<string, typeof plans>)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Object.entries(groupedPlans).map(([productId, productPlans], index) => {
        const product = productPlans[0].product
        const isPopular = index === 1 // Middle card as popular
        
        return (
          <div
            key={productId}
            className={`group relative bg-white rounded-2xl shadow-soft hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${
              isPopular
                ? 'border-primary-500 scale-105 md:scale-110 lg:scale-105'
                : 'border-gray-200 hover:border-primary-200'
            }`}
          >
            {/* Popular Badge */}
            {isPopular && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-1 rounded-bl-xl text-xs font-bold">
                POPÜLER
              </div>
            )}

            {/* Gradient accent */}
            <div className={`absolute top-0 left-0 w-full h-1 ${
              isPopular
                ? 'bg-gradient-to-r from-primary-500 via-orange-500 to-primary-600'
                : 'bg-gradient-to-r from-primary-400 to-primary-500'
            }`}></div>

            <div className="p-8">
              {/* Product Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-3">{product.name}</h3>
                <p className="text-gray-600 leading-relaxed">{product.shortDescription}</p>
              </div>

              {/* Plans */}
              <div className="space-y-4 mb-8">
                {productPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-gray-900 block mb-1">{plan.name}</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          {plan.billingPeriod === 'MONTHLY' && 'Aylık'}
                          {plan.billingPeriod === 'YEARLY' && 'Yıllık'}
                          {plan.billingPeriod === 'LIFETIME' && 'Tek Seferlik'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                          {formatCurrency(Number(plan.price), plan.currency)}
                        </span>
                        {plan.billingPeriod !== 'LIFETIME' && (
                          <span className="text-sm text-gray-500 block">
                            {plan.billingPeriod === 'MONTHLY' && '/ay'}
                            {plan.billingPeriod === 'YEARLY' && '/yıl'}
                          </span>
                        )}
                      </div>
                    </div>
                    {plan.description && (
                      <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="mb-8 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  <span>7 gün ücretsiz deneme</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  <span>7/24 destek</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  <span>İstediğiniz zaman iptal</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Link
                  href={`/products/${product.slug}?startTrial=true`}
                  className={`block w-full text-center py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn ${
                    isPopular
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>7 Gün Ücretsiz Dene</span>
                </Link>
                <Link
                  href={`/products/${product.slug}`}
                  className="block w-full text-center py-3 rounded-xl font-semibold text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 transition-all border border-gray-200 hover:border-gray-300 flex items-center justify-center gap-2 group/link"
                >
                  Detayları Gör
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

