import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <h3 className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                E2X
              </h3>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Tüm sektörler için profesyonel otomasyon çözümleri. İşletmenizi dijitalleştirin ve verimliliğinizi artırın.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Ürünler</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Tüm Paneller
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Fiyatlandırma
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Destek</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Blog
                </Link>
              </li>
              <li>
                <a href="#faq" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  SSS
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">İletişim</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-1">📞</span>
                <div>
                  <a href="tel:+905315661805" className="hover:text-primary-400 transition-colors">
                    0531 566 18 05
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-1">✉️</span>
                <div>
                  <a href="mailto:e2xldigital@gmail.com" className="hover:text-primary-400 transition-colors break-all">
                    e2xldigital@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-1">📍</span>
                <div>
                  Nilüfer<br />
                  Bursa, Türkiye
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400 mt-1">🏢</span>
                <div>
                  Vergi No: 7860379549<br />
                  <span className="text-xs text-gray-400">Vergi Dairesi: Çekirge</span>
                </div>
              </li>
              <li className="mt-4">
                <Link href="/iletisim" className="text-primary-400 hover:text-primary-300 transition-colors font-medium">
                  Tüm İletişim Bilgileri →
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} E2X - İş Otomasyon Panelleri. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/gizlilik-politikasi" className="hover:text-primary-400 transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="/kullanim-sartlari" className="hover:text-primary-400 transition-colors">
                Kullanım Şartları
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

