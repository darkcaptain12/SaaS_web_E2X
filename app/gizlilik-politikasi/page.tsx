import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası',
  description: 'E2X Gizlilik Politikası - Kişisel verilerinizin korunması ve kullanımı hakkında bilgiler',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Gizlilik Politikası</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Son Güncelleme:</strong> {new Date().getFullYear()} yılı
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Genel Bilgiler</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            E2X - İş Otomasyon Panelleri olarak, kişisel verilerinizin korunmasına büyük önem vermekteyiz. 
            Bu Gizlilik Politikası, web sitemizi ziyaret ettiğinizde veya hizmetlerimizi kullandığınızda 
            toplanan bilgilerin nasıl toplandığını, kullanıldığını ve korunduğunu açıklamaktadır.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Toplanan Bilgiler</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Hizmetlerimizi sağlamak için aşağıdaki bilgileri toplayabiliriz:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Ad, soyad ve iletişim bilgileri</li>
            <li>E-posta adresi</li>
            <li>Telefon numarası</li>
            <li>İşletme adı</li>
            <li>Ödeme bilgileri (PayTR üzerinden güvenli şekilde işlenir)</li>
            <li>Kullanım verileri ve analitik bilgiler</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Bilgilerin Kullanımı</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Toplanan bilgiler aşağıdaki amaçlarla kullanılır:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Hizmetlerimizi sağlamak ve geliştirmek</li>
            <li>Müşteri desteği sunmak</li>
            <li>Ödemeleri işlemek</li>
            <li>Yasal yükümlülükleri yerine getirmek</li>
            <li>Güvenlik ve dolandırıcılık önleme</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Veri Güvenliği</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Kişisel verilerinizin güvenliğini sağlamak için endüstri standardı güvenlik önlemleri 
            almaktayız. Verileriniz şifrelenmiş olarak saklanır ve yetkisiz erişime karşı korunur.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Çerezler (Cookies)</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır. 
            Çerezleri tarayıcı ayarlarınızdan yönetebilirsiniz.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. KVKK Haklarınız</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aşağıdaki haklara sahipsiniz:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse bilgi talep etme</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
            <li>İşlenmesini gerektiren sebeplerin ortadan kalkması halinde silinmesini veya yok edilmesini isteme</li>
            <li>Düzeltme, silme, yok etme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
            <li>Münhasıran otomatik sistemler ile analiz edilmesi nedeniyle aleyhinize bir sonuç doğmasına itiraz etme</li>
            <li>Kanuna aykırı işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. İletişim</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Gizlilik politikamız hakkında sorularınız veya haklarınızı kullanmak istiyorsanız, 
            aşağıdaki iletişim bilgilerinden bizimle iletişime geçebilirsiniz:
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

