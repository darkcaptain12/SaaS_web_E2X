import Link from 'next/link'
import Hero from '@/components/Hero'
import ProductCard from '@/components/ProductCard'
import { prisma } from '@/lib/prisma'

async function getProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function HomePage() {
  const products = await getProducts()

  return (
    <div>
      <Hero />

      {/* Key Systems Section - 3 Main Panels */}
      <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-orange-100 text-primary-700 px-6 py-3 rounded-full text-sm font-bold mb-6 border-2 border-primary-200 shadow-md">
              <span className="text-xl">⭐</span>
              <span>3 Profesyonel Panel</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Ana Otomasyon Panelleri
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-light">
              Tüm sektörler için özel tasarlanmış profesyonel otomasyon panelleri
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {products.length > 0 ? (
              products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))
            ) : (
              <>
                <ProductCard
                  product={{
                    id: '1',
                    slug: 'yonetim-paneli',
                    name: 'Yönetim Paneli',
                    description: '',
                    shortDescription: 'İşletmeler için profesyonel otomasyon paneli - Personel, operasyon ve sipariş yönetimi',
                    category: null,
                    categoryId: null,
                    demoUrl: null,
                    demoUsername: null,
                    demoPassword: null,
                    trialDays: 7,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  }}
                  index={0}
                />
                <ProductCard
                  product={{
                    id: '2',
                    slug: 'operasyon-paneli',
                    name: 'Operasyon Paneli',
                    description: '',
                    shortDescription: 'Üretim ve operasyon süreçleri için özel tasarlanmış panel - Sipariş görüntüleme ve üretim yönetimi',
                    category: null,
                    categoryId: null,
                    demoUrl: null,
                    demoUsername: null,
                    demoPassword: null,
                    trialDays: 7,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  }}
                  index={1}
                />
                <ProductCard
                  product={{
                    id: '3',
                    slug: 'satis-paneli',
                    name: 'Satış Paneli',
                    description: '',
                    shortDescription: 'Satış ve müşteri hizmetleri için özel panel - Sipariş yönetimi, stok ve satış operasyonları',
                    category: null,
                    categoryId: null,
                    demoUrl: null,
                    demoUsername: null,
                    demoPassword: null,
                    trialDays: 7,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  }}
                  index={2}
                />
              </>
            )}
          </div>
          <div className="text-center mt-16">
            <div className="inline-flex flex-col items-center gap-4">
              <p className="text-gray-600 text-lg font-medium">
                Her panel 7 gün ücretsiz deneme ile test edilebilir
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-10 py-4 rounded-xl font-bold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
              >
                Tüm Panelleri İncele
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent"></div>
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-primary-300 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-orange-300 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sadece 3 adımda başlayın
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-200 transform hover:-translate-y-2 animate-slide-up">
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute inset-0 bg-primary-100 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse-slow"></div>
                <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse-slow"></div>
                  <span className="relative text-3xl font-bold text-white">1</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors">Panel Seçin</h3>
              <p className="text-gray-600 leading-relaxed">
                İhtiyacınıza uygun otomasyon panelini seçin
              </p>
            </div>
            <div className="group text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-200 transform hover:-translate-y-2 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute inset-0 bg-primary-100 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse-slow animation-delay-2000"></div>
                <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse-slow"></div>
                  <span className="relative text-3xl font-bold text-white">2</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors">7 Gün Ücretsiz Dene</h3>
              <p className="text-gray-600 leading-relaxed">
                Hesap oluşturup 7 gün boyunca ücretsiz deneyin
              </p>
            </div>
            <div className="group text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-200 transform hover:-translate-y-2 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute inset-0 bg-primary-100 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse-slow animation-delay-4000"></div>
                <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse-slow"></div>
                  <span className="relative text-3xl font-bold text-white">3</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors">Beğenirseniz Satın Alın</h3>
              <p className="text-gray-600 leading-relaxed">
                Beğendiyseniz PayTR ile güvenli ödeme yaparak devam edin
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Neden Bizi Seçmelisiniz?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              İşletmeniz için en iyi çözümü sunuyoruz
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '☁️', title: 'Bulut & Masaüstü Seçenekleri', desc: 'İstediğiniz platformda çalışır' },
              { icon: '🇹🇷', title: 'Türkçe Destek', desc: '7/24 Türkçe müşteri desteği' },
              { icon: '🔒', title: 'Güvenli Ödeme', desc: 'PayTR ile güvenli ödeme altyapısı' },
              { icon: '⚡', title: 'Kolay Kurulum', desc: 'Hızlı ve kolay kurulum süreci' },
              { icon: '🏢', title: 'Çoklu Şube Desteği', desc: 'Birden fazla şube yönetimi' },
              { icon: '📈', title: 'Detaylı Raporlama', desc: 'Kapsamlı analiz ve raporlar' },
            ].map((benefit, index) => (
              <div 
                key={index} 
                className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-primary-200 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">{benefit.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-primary-600 transition-colors">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-primary-100/0 group-hover:from-primary-50/50 group-hover:to-primary-100/30 rounded-2xl transition-all duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Sık Sorulan Sorular
            </h2>
            <p className="text-xl text-gray-600">
              Merak ettiklerinizin cevapları
            </p>
          </div>
          <div className="space-y-4">
            {[
              {
                q: 'Deneme süresi ne kadar?',
                a: 'Tüm sistemlerde 7 gün ücretsiz deneme süresi sunuyoruz. Deneme süresi sonunda otomatik olarak sona erer.',
              },
              {
                q: 'Ödeme nasıl yapılır?',
                a: 'PayTR güvenli ödeme altyapısı ile kredi kartı veya banka kartı ile ödeme yapabilirsiniz.',
              },
              {
                q: 'İptal edebilir miyim?',
                a: 'Evet, aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal işlemi sonraki faturalama döneminde geçerli olur.',
              },
              {
                q: 'Verilerim güvende mi?',
                a: 'Evet, tüm verileriniz şifrelenmiş olarak saklanır ve yedeklenir. Veri güvenliği bizim önceliğimizdir.',
              },
            ].map((faq, index) => (
              <div key={index} className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary-200">
                <h3 className="font-bold text-lg mb-3 text-gray-900 group-hover:text-primary-600 transition-colors">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

