'use client'

import Link from 'next/link'
import { Product } from '@prisma/client'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface ProductCardProps {
  product: Product & { category?: { id: string; name: string; icon: string; color?: string | null } | null }
  index?: number
}

// Default colors if category doesn't have color
const getDefaultColors = (index: number) => {
  const gradients = [
    { gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', border: 'border-blue-200' },
    { gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-50', border: 'border-orange-200' },
    { gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-50', border: 'border-purple-200' },
    { gradient: 'from-green-500 to-emerald-500', bg: 'bg-green-50', border: 'border-green-200' },
    { gradient: 'from-pink-500 to-rose-500', bg: 'bg-pink-50', border: 'border-pink-200' },
  ]
  return gradients[index % gradients.length]
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [])

  // Get icon and colors from category or use defaults
  const icon = product.category?.icon || '✨'
  const categoryName = product.category?.name || 'Kategori'
  
  // Use category color if available and valid, otherwise use default based on index
  const defaultColors = getDefaultColors(index)
  const categoryColor = product.category?.color
  
  // Check if category color is a valid Tailwind gradient format
  const isValidGradient = categoryColor && typeof categoryColor === 'string' && (
    categoryColor.includes('from-') && categoryColor.includes('to-')
  )
  
  // Always ensure we have a valid gradient
  const colors = isValidGradient
    ? {
        gradient: categoryColor as string,
        bg: 'bg-primary-50',
        border: 'border-primary-200',
      }
    : defaultColors
  
  // Final safety check - ensure gradient is always valid
  // Map category colors to ensure they're always valid Tailwind classes
  const gradientMap: Record<string, string> = {
    'from-blue-500 to-cyan-500': 'from-blue-500 to-cyan-500',
    'from-pink-500 to-rose-500': 'from-pink-500 to-rose-500',
    'from-gray-500 to-gray-700': 'from-gray-500 to-gray-700',
    'from-red-500 to-pink-500': 'from-red-500 to-pink-500',
    'from-indigo-500 to-purple-500': 'from-indigo-500 to-purple-500',
    'from-green-500 to-emerald-500': 'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500': 'from-orange-500 to-red-500',
    'from-purple-500 to-pink-500': 'from-purple-500 to-pink-500',
  }
  
  const rawGradient = colors.gradient && colors.gradient.trim() !== '' 
    ? colors.gradient 
    : 'from-primary-600 to-primary-700'
  
  // Use mapped gradient if available, otherwise use raw gradient, fallback to primary
  const finalGradient = gradientMap[rawGradient] || rawGradient || 'from-primary-600 to-primary-700'

  const hoverBgClass = colors.bg === 'bg-blue-50' ? 'group-hover:bg-blue-50/30' :
                       colors.bg === 'bg-orange-50' ? 'group-hover:bg-orange-50/30' :
                       colors.bg === 'bg-purple-50' ? 'group-hover:bg-purple-50/30' :
                       'group-hover:bg-primary-50/30'

  return (
    <div 
      ref={cardRef}
      className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 ${colors.border} hover:border-opacity-100 transform hover:-translate-y-2 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Gradient accent line with animation */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${finalGradient} group-hover:h-1.5 transition-all duration-300`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
      </div>
      
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 ${hoverBgClass} transition-all duration-300`}></div>
      
      {/* Animated glow effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${finalGradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
      
      <div className="relative p-6">
        {/* Icon with gradient background and pulse */}
        <div className={`relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${finalGradient} mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-2xl`}>
          <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse-slow"></div>
          <span className="relative text-3xl transform group-hover:scale-110 transition-transform duration-300">{icon}</span>
        </div>

        {/* Category badge */}
        <span className={`inline-block ${colors.bg} text-gray-700 text-xs font-bold px-3 py-1 rounded-full mb-3 border ${colors.border}`}>
          {categoryName}
        </span>

        <h3 className="text-2xl font-extrabold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed text-base">
          {product.shortDescription}
        </p>

        {/* Trial badge with animation */}
        <div className={`flex items-center gap-2 text-sm font-bold mb-6 px-4 py-2 rounded-xl ${colors.bg} border ${colors.border} group-hover:scale-105 transition-transform duration-300`}>
          <Sparkles className="w-4 h-4 text-primary-600 animate-pulse-slow group-hover:animate-spin-slow" />
          <span className="text-gray-700">{product.trialDays} gün ücretsiz deneme</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href={`/products/${product.slug}?startTrial=true`}
            className={`group/btn relative w-full text-white px-4 py-3.5 rounded-xl font-bold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:scale-105 overflow-hidden min-h-[48px] block bg-gradient-to-r ${finalGradient}`}
            style={{
              background: finalGradient.includes('from-') && finalGradient.includes('to-') 
                ? undefined 
                : 'linear-gradient(to right, #F97316, #EA580C)',
            }}
          >
            <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
            <Sparkles className="w-5 h-5 relative z-10 group-hover/btn:rotate-12 transition-transform duration-300 flex-shrink-0" />
            <span className="relative z-10 whitespace-nowrap">Ücretsiz Dene</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300 flex-shrink-0" />
          </Link>
          <Link
            href={`/products/${product.slug}`}
            className="w-full text-gray-700 hover:text-primary-600 font-semibold text-sm py-2.5 flex items-center justify-center gap-2 group/link border-2 border-gray-200 hover:border-primary-300 rounded-xl transition-all"
          >
            Detayları Gör
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Decorative corner with animation */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-200/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-white/10 rounded-bl-full animate-pulse-slow"></div>
      </div>
      
      {/* Floating particles on hover */}
      <div className="absolute top-4 right-4 w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-float transition-opacity duration-300" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-8 right-8 w-1 h-1 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-float transition-opacity duration-300" style={{ animationDelay: '0.3s' }}></div>
      <div className="absolute top-12 right-12 w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-float transition-opacity duration-300" style={{ animationDelay: '0.6s' }}></div>
    </div>
  )
}

