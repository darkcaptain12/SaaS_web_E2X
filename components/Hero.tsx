'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Additional floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
        
        {/* Gradient mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-gradient"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          {/* Badge with animation */}
          <div className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20 animate-slide-up ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <Sparkles className="w-4 h-4 animate-pulse-slow" />
            <span>7 Gün Ücretsiz Deneme</span>
          </div>

          <h1 className={`text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight animate-fade-in ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}>
            E2X
            <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent animate-gradient-text">
              İş Otomasyon Panelleri
            </span>
          </h1>
          
          <p className={`text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto font-light animate-slide-up ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 delay-200`}>
            3 Profesyonel Panel ile İşletmenizi Dijitalleştirin
          </p>
          
          <p className={`text-lg text-white/80 mb-10 max-w-2xl mx-auto animate-fade-in ${isVisible ? 'opacity-100' : 'opacity-0'} transition-all duration-700 delay-300`}>
            Tüm sektörler için özel tasarlanmış profesyonel otomasyon panelleri
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center animate-zoom-in ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} transition-all duration-700 delay-500`}>
            <Link
              href="/products"
              className="group relative bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-white/50 hover:scale-105 flex items-center gap-2 overflow-hidden"
            >
              <span className="absolute inset-0 shimmer"></span>
              <span className="relative z-10 flex items-center gap-2">
                Panelleri Keşfet
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/auth/register"
              className="group relative bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 shadow-xl border-2 border-white/30 hover:border-white/50 flex items-center gap-2 animate-pulse-slow hover:animate-none"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>7 Gün Ücretsiz Dene</span>
            </Link>
          </div>

          {/* Stats with animation */}
          <div className={`mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-slide-up ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 delay-700`}>
            {[
              { value: '3', label: 'Profesyonel Panel' },
              { value: '7', label: 'Gün Ücretsiz' },
              { value: '24/7', label: 'Destek' },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all animate-pulse-slow"></div>
                  <div className="relative text-3xl md:text-4xl font-bold text-white mb-2 transform group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                </div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-12 fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.48,111.28,22.88,148.26,59.26,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.48,111.28,22.88,148.26,59.26V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
    </section>
  )
}

