import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kullanım Şartları',
  description: 'E2X Kullanım Şartları - Hizmetlerimizi kullanırken uymanız gereken kurallar ve koşullar',
}

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Kullanım Şartları</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Son Güncelleme:</strong> {new Date().getFullYear()} yılı
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Genel Hükümler</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            E2X - İş Otomasyon Panelleri hizmetlerini kullanarak, aşağıdaki kullanım şartlarını 
            kabul etmiş sayılırsınız. Bu şartları kabul etmiyorsanız, lütfen hizmetlerimizi kullanmayın.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Hizmet Tanımı</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            E2X, işletmeler için otomasyon paneli hizmetleri sunmaktadır. Hizmetlerimiz:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Yönetim Paneli</li>
            <li>Operasyon Paneli</li>
            <li>Satış Paneli</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4">
            Her panel için 7 günlük ücretsiz deneme süresi sunulmaktadır.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Hesap Oluşturma</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Hizmetlerimizi kullanmak için bir hesap oluşturmanız gerekmektedir. Hesap oluştururken:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Doğru ve güncel bilgiler sağlamalısınız</li>
            <li>Hesap bilgilerinizin güvenliğinden siz sorumlusunuz</li>
            <li>Hesabınızın yetkisiz kullanımından derhal haber vermelisiniz</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Ücretsiz Deneme</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Her ürün için 7 günlük ücretsiz deneme süresi sunulmaktadır. Deneme süresi:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Kayıt olduğunuz tarihten itibaren başlar</li>
            <li>7 gün sonra otomatik olarak sona erer</li>
            <li>Aynı ürün için sadece bir kez kullanılabilir</li>
            <li>Deneme süresi sonunda otomatik olarak iptal edilir</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Ödeme ve Faturalama</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Ödemeler PayTR güvenli ödeme altyapısı üzerinden yapılmaktadır:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Ödemeler aylık olarak tahsil edilir</li>
            <li>Fiyatlar Türk Lirası (TRY) cinsindendir</li>
            <li>Ödeme başarısız olursa hizmet askıya alınabilir</li>
            <li>İade politikası için destek ekibimizle iletişime geçin</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Abonelik İptali</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Aboneliğinizi istediğiniz zaman iptal edebilirsiniz:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>İptal işlemi sonraki faturalama döneminde geçerli olur</li>
            <li>İptal edilen aboneliklerin önceden ödenen ücretleri iade edilmez</li>
            <li>İptal sonrası hizmete erişim sona erer</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Kullanıcı Yükümlülükleri</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Hizmetlerimizi kullanırken:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Yasalara ve düzenlemelere uymalısınız</li>
            <li>Hizmetleri kötüye kullanmamalısınız</li>
            <li>Başkalarının haklarına saygı göstermelisiniz</li>
            <li>Zararlı içerik paylaşmamalısınız</li>
            <li>Hizmetlerin güvenliğini tehlikeye atmamalısınız</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Fikri Mülkiyet</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            E2X hizmetleri ve içeriği telif hakkı ve diğer fikri mülkiyet yasaları ile korunmaktadır. 
            İzinsiz kopyalama, dağıtma veya kullanım yasaktır.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Hizmet Kesintileri</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Bakım, güncelleme veya teknik sorunlar nedeniyle hizmetlerimizde geçici kesintiler 
            olabilir. Bu durumlardan sorumlu tutulamayız.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Sorumluluk Sınırlaması</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            E2X, hizmetlerin kesintisiz veya hatasız olacağını garanti etmez. Hizmetlerimizin 
            kullanımından kaynaklanan doğrudan veya dolaylı zararlardan sorumlu tutulamayız.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Değişiklikler</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Bu kullanım şartlarını istediğimiz zaman değiştirme hakkını saklı tutarız. 
            Önemli değişiklikler kullanıcılara bildirilecektir.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">12. İletişim</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Kullanım şartları hakkında sorularınız için aşağıdaki iletişim bilgilerinden 
            bizimle iletişime geçebilirsiniz:
          </p>
          <div className="bg-gray-50 rounded-lg p-6 mt-4">
            <ul className="space-y-2 text-gray-700">
              <li><strong>Telefon/WhatsApp:</strong> <a href="tel:+905315661805" className="text-primary-600 hover:underline">0531 566 18 05</a></li>
              <li><strong>E-posta:</strong> <a href="mailto:e2xldigital@gmail.com" className="text-primary-600 hover:underline">e2xldigital@gmail.com</a></li>
              <li><strong>Adres:</strong> Nilüfer, Bursa, Türkiye</li>
              <li><strong>Vergi No:</strong> 7860379549</li>
              <li><strong>Vergi Dairesi:</strong> Çekirge</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}

