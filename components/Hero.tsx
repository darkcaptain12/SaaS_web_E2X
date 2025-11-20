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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full-screen Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.pexels.com/videos/3045163/pexels-photo-3045163.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        >
          {/* Otomasyon sistemlerine uygun stock video - Pexels'den */}
          {/* Dashboard/Technology video - İş otomasyon sistemlerine uygun */}
          <source src="https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4" type="video/mp4" />
          {/* Alternatif: Technology/Business video */}
          <source src="https://videos.pexels.com/video-files/2491284/2491284-hd_1920_1080_30fps.mp4" type="video/mp4" />
          {/* Alternatif: Data/Technology video */}
          <source src="https://videos.pexels.com/video-files/3045163/3045163-uhd_2560_1440_30fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-800/70 to-orange-900/80"></div>
        
        {/* Additional gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Animated particles overlay */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
        <div className="text-center">
          {/* Badge with animation */}
          <div className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-bold mb-8 border-2 border-white/30 shadow-2xl animate-slide-up ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <Sparkles className="w-5 h-5 animate-pulse-slow" />
            <span>7 Gün Ücretsiz Deneme</span>
          </div>

          <h1 className={`text-6xl md:text-8xl lg:text-9xl font-extrabold text-white mb-8 leading-tight drop-shadow-2xl animate-fade-in ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}>
            E2X
            <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent animate-gradient-text drop-shadow-lg">
              İş Otomasyon Panelleri
            </span>
          </h1>
          
          <p className={`text-2xl md:text-3xl lg:text-4xl text-white/95 mb-6 max-w-4xl mx-auto font-light drop-shadow-lg animate-slide-up ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 delay-200`}>
            3 Profesyonel Panel ile İşletmenizi Dijitalleştirin
          </p>
          
          <p className={`text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto drop-shadow-md animate-fade-in ${isVisible ? 'opacity-100' : 'opacity-0'} transition-all duration-700 delay-300`}>
            Tüm sektörler için özel tasarlanmış profesyonel otomasyon panelleri
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center animate-zoom-in ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} transition-all duration-700 delay-500`}>
            <Link
              href="/products"
              className="group relative bg-white text-primary-600 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-white/50 hover:scale-110 flex items-center gap-3 overflow-hidden backdrop-blur-sm"
            >
              <span className="absolute inset-0 shimmer"></span>
              <span className="relative z-10 flex items-center gap-3">
                Panelleri Keşfet
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>
            <Link
              href="/auth/register"
              className="group relative bg-white/20 backdrop-blur-md text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-white/30 transition-all duration-300 shadow-2xl border-2 border-white/40 hover:border-white/60 flex items-center gap-3 animate-pulse-slow hover:animate-none"
            >
              <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span>7 Gün Ücretsiz Dene</span>
            </Link>
          </div>

          {/* Stats with animation */}
          <div className={`mt-20 grid grid-cols-3 gap-8 max-w-4xl mx-auto animate-slide-up ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 delay-700`}>
            {[
              { value: '3', label: 'Profesyonel Panel' },
              { value: '7', label: 'Gün Ücretsiz' },
              { value: '24/7', label: 'Destek' },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl group-hover:blur-3xl transition-all animate-pulse-slow"></div>
                  <div className="relative text-5xl md:text-6xl font-bold text-white mb-3 transform group-hover:scale-125 transition-transform duration-300 drop-shadow-2xl">
                    {stat.value}
                  </div>
                </div>
                <div className="text-white/90 text-base md:text-lg font-semibold drop-shadow-lg">{stat.label}</div>
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

