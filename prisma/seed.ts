import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      phone: '+905551234567',
      businessName: 'Admin Business',
      role: 'ADMIN',
    },
  })
  console.log('Admin user created:', admin.email)

  // Create default settings
  const settings = await prisma.settings.upsert({
    where: { id: 'settings' },
    update: {},
    create: {
      id: 'settings',
      siteName: 'İş Otomasyon',
      primaryColor: '#F97316',
    },
  })
  console.log('Settings created/updated')

  // Create categories
  const categories = [
    {
      name: 'Yiyecek İçecek Sektörü',
      icon: '🍽️',
      color: 'from-blue-500 to-cyan-500',
      description: 'Restoran, kafe, bar ve yiyecek-içecek işletmeleri için otomasyon çözümleri',
      isActive: true,
    },
    {
      name: 'Güzellik Sektörü',
      icon: '💄',
      color: 'from-pink-500 to-rose-500',
      description: 'Kuaför, güzellik salonu ve spa işletmeleri için otomasyon çözümleri',
      isActive: true,
    },
    {
      name: 'Otomotiv Sektörü',
      icon: '🚗',
      color: 'from-gray-500 to-gray-700',
      description: 'Oto yıkama, oto tamir ve otomotiv işletmeleri için otomasyon çözümleri',
      isActive: true,
    },
    {
      name: 'Sağlık Sektörü',
      icon: '🏥',
      color: 'from-red-500 to-pink-500',
      description: 'Hastane, klinik ve sağlık kuruluşları için otomasyon çözümleri',
      isActive: true,
    },
    {
      name: 'Eğitim Sektörü',
      icon: '🏫',
      color: 'from-indigo-500 to-purple-500',
      description: 'Okul, kurs ve eğitim kurumları için otomasyon çözümleri',
      isActive: true,
    },
    {
      name: 'Perakende Sektörü',
      icon: '🛍️',
      color: 'from-green-500 to-emerald-500',
      description: 'Mağaza, market ve perakende işletmeleri için otomasyon çözümleri',
      isActive: true,
    },
  ]

  const createdCategories: Record<string, string> = {}
  for (const catData of categories) {
    const category = await prisma.category.upsert({
      where: { name: catData.name },
      update: {
        icon: catData.icon,
        color: catData.color,
        description: catData.description,
      },
      create: catData,
    })
    createdCategories[catData.name] = category.id
    console.log('Category created/updated:', category.name)
  }

  // Create sample products - Multiple products across different categories
  const products = [
    {
      slug: 'yonetim-paneli',
      name: 'Yönetim Paneli',
      description: `İşletmeler için kapsamlı otomasyon paneli. Personel yönetimi, operasyon takibi, sipariş yönetimi ve daha fazlası.

Özellikler:
- 📋 Gerçek zamanlı sipariş ve iş yönetimi
- 📊 Durum takibi ve rezervasyon yönetimi
- 👥 Personel atama ve performans analizi
- 📱 Mobil uyumlu tablet arayüzü
- 🏢 Çoklu şube yönetimi
- 💰 Anlık ciro ve finansal takip
- 📈 Detaylı raporlama ve analizler`,
      shortDescription: 'İşletmeler için profesyonel otomasyon paneli - Personel, operasyon ve sipariş yönetimi',
      categoryId: createdCategories['Yiyecek İçecek Sektörü'],
      trialDays: 7,
      isActive: true,
      demoUrl: 'https://demo.example.com/restoran',
      demoUsername: 'demo',
      demoPassword: 'demo123',
    },
    {
      slug: 'operasyon-paneli',
      name: 'Operasyon Paneli',
      description: `Üretim ve operasyon süreçlerini optimize eden profesyonel panel. Sipariş görüntüleme, üretim takibi ve operasyon yönetimi.

Özellikler:
- 🖥️ Büyük ekran görüntüleme (TV/Tablet)
- ⚡ Sipariş önceliklendirme sistemi
- ⏱️ Üretim süresi takibi
- 🔊 Sesli ve görsel bildirimler
- 📋 Sipariş geçmişi ve istatistikler
- 🔄 Otomatik sipariş güncellemeleri
- 👷 Ekip ve personel yönetimi`,
      shortDescription: 'Üretim ve operasyon süreçleri için özel tasarlanmış panel - Sipariş görüntüleme ve üretim yönetimi',
      categoryId: createdCategories['Yiyecek İçecek Sektörü'],
      trialDays: 7,
      isActive: true,
      demoUrl: 'https://demo.example.com/mutfak',
      demoUsername: 'demo',
      demoPassword: 'demo123',
    },
    {
      slug: 'satis-paneli',
      name: 'Satış Paneli',
      description: `Satış ve müşteri hizmetleri için özel tasarlanmış otomasyon paneli. Sipariş yönetimi, stok takibi ve satış operasyonları.

Özellikler:
- 🛒 Sipariş ve satış yönetimi
- 📊 Stok ve envanter takibi
- 🎯 Özel ürün ve hizmet yönetimi
- ⏰ İşlem süresi optimizasyonu
- 📱 Mobil satış ekranı
- 💳 Ödeme entegrasyonu
- 📈 Satış performans analizleri`,
      shortDescription: 'Satış ve müşteri hizmetleri için özel panel - Sipariş yönetimi, stok ve satış operasyonları',
      categoryId: createdCategories['Perakende Sektörü'],
      trialDays: 7,
      isActive: true,
      demoUrl: 'https://demo.example.com/bar',
      demoUsername: 'demo',
      demoPassword: 'demo123',
    },
    {
      slug: 'guzellik-merkezi-yonetim',
      name: 'Güzellik Merkezi Yönetim ve Randevu Sistemi',
      description: `Güzellik salonları, kuaförler ve spa merkezleri için kapsamlı yönetim ve randevu sistemi. Müşteri takibi, randevu yönetimi ve personel organizasyonu.

Özellikler:
- 📅 Online randevu sistemi
- 👤 Müşteri bilgi yönetimi ve geçmiş
- 💇 Hizmet ve paket yönetimi
- 👥 Personel ve usta yönetimi
- 📊 Gelir ve performans raporları
- 📱 Mobil uyumlu arayüz
- 💳 Ödeme ve faturalama sistemi
- 🔔 SMS ve email bildirimleri`,
      shortDescription: 'Güzellik salonları ve spa merkezleri için profesyonel randevu ve yönetim sistemi',
      categoryId: createdCategories['Güzellik Sektörü'],
      trialDays: 7,
      isActive: true,
      demoUrl: 'https://demo.example.com/guzellik',
      demoUsername: 'demo',
      demoPassword: 'demo123',
    },
    {
      slug: 'klinik-yonetim-sistemi',
      name: 'Klinik Yönetim Sistemi',
      description: `Sağlık kuruluşları, klinikler ve muayenehaneler için kapsamlı hasta ve işletme yönetim sistemi. Hasta kayıtları, randevu takibi ve tıbbi kayıt yönetimi.

Özellikler:
- 🏥 Hasta kayıt ve bilgi yönetimi
- 📅 Randevu planlama ve takibi
- 📋 Tıbbi kayıt ve dosya yönetimi
- 💊 Reçete ve ilaç takibi
- 📊 Hasta istatistikleri ve raporlar
- 🔒 Güvenli veri saklama (KVKK uyumlu)
- 📱 Mobil erişim
- 💳 Fatura ve ödeme yönetimi`,
      shortDescription: 'Klinikler ve muayenehaneler için hasta yönetim ve randevu sistemi',
      categoryId: createdCategories['Sağlık Sektörü'],
      trialDays: 7,
      isActive: true,
      demoUrl: 'https://demo.example.com/klinik',
      demoUsername: 'demo',
      demoPassword: 'demo123',
    },
    {
      slug: 'egitim-kurumu-yonetim',
      name: 'Eğitim Kurumu Yönetim Sistemi',
      description: `Okullar, kurslar ve eğitim kurumları için öğrenci, öğretmen ve ders yönetim sistemi. Devam takibi, not yönetimi ve veli iletişimi.

Özellikler:
- 👨‍🎓 Öğrenci kayıt ve bilgi yönetimi
- 👨‍🏫 Öğretmen ve personel yönetimi
- 📚 Ders programı ve müfredat yönetimi
- 📝 Devam takibi ve yoklama sistemi
- 📊 Not ve başarı takibi
- 👨‍👩‍👧 Veli iletişim ve bildirim sistemi
- 📱 Mobil uygulama desteği
- 📈 Detaylı raporlama ve analiz`,
      shortDescription: 'Okullar ve kurslar için öğrenci, öğretmen ve ders yönetim sistemi',
      categoryId: createdCategories['Eğitim Sektörü'],
      trialDays: 7,
      isActive: true,
      demoUrl: 'https://demo.example.com/egitim',
      demoUsername: 'demo',
      demoPassword: 'demo123',
    },
    {
      slug: 'oto-yikama-yonetim',
      name: 'Oto Yıkama Yönetim Sistemi',
      description: `Oto yıkama, detay ve bakım merkezleri için hizmet yönetim sistemi. Araç takibi, paket yönetimi ve müşteri ilişkileri.

Özellikler:
- 🚗 Araç kayıt ve takip sistemi
- 🧼 Hizmet paketleri ve fiyat yönetimi
- 📅 Randevu ve sıra yönetimi
- 💳 Ödeme ve faturalama
- 👥 Personel ve görev yönetimi
- 📊 Gelir ve performans raporları
- 📱 Tablet ve mobil uyumlu
- 🔔 Müşteri bildirimleri`,
      shortDescription: 'Oto yıkama ve detay merkezleri için hizmet ve müşteri yönetim sistemi',
      categoryId: createdCategories['Otomotiv Sektörü'],
      trialDays: 7,
      isActive: true,
      demoUrl: 'https://demo.example.com/otoyikama',
      demoUsername: 'demo',
      demoPassword: 'demo123',
    },
    {
      slug: 'magaza-yonetim-sistemi',
      name: 'Mağaza Yönetim Sistemi',
      description: `Perakende mağazalar, marketler ve satış noktaları için stok, satış ve müşteri yönetim sistemi. POS entegrasyonu ve envanter takibi.

Özellikler:
- 🛒 Satış ve POS entegrasyonu
- 📦 Stok ve envanter yönetimi
- 👤 Müşteri ve üyelik sistemi
- 💰 Fiyat ve kampanya yönetimi
- 📊 Satış raporları ve analiz
- 🏷️ Barkod ve etiket yönetimi
- 📱 Mobil satış noktası
- 🔄 Tedarikçi ve sipariş yönetimi`,
      shortDescription: 'Perakende mağazalar için stok, satış ve müşteri yönetim sistemi',
      categoryId: createdCategories['Perakende Sektörü'],
      trialDays: 7,
      isActive: true,
      demoUrl: 'https://demo.example.com/magaza',
      demoUsername: 'demo',
      demoPassword: 'demo123',
    },
    {
      slug: 'restoran-adisyon-sistemi',
      name: 'Restorant Yönetim & Adisyon Sistemi',
      description: `Restoranlar, kafeler ve barlar için masa yönetimi, sipariş takibi ve adisyon sistemi. Mutfak entegrasyonu ve ödeme yönetimi.

Özellikler:
- 🍽️ Masa ve rezervasyon yönetimi
- 📋 Sipariş alma ve takip sistemi
- 🍳 Mutfak ekranı entegrasyonu
- 💳 Adisyon ve ödeme yönetimi
- 📊 Günlük ciro ve raporlar
- 👥 Garson ve personel yönetimi
- 📱 Tablet menü ve sipariş
- 🔔 Sipariş bildirimleri`,
      shortDescription: 'Restoranlar ve kafeler için masa, sipariş ve adisyon yönetim sistemi',
      categoryId: createdCategories['Yiyecek İçecek Sektörü'],
      trialDays: 7,
      isActive: true,
      demoUrl: 'https://demo.example.com/restoran-adisyon',
      demoUsername: 'demo',
      demoPassword: 'demo123',
    },
  ]

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
      include: {
        category: true,
      },
    })
    console.log('Product created:', product.name)

    // Create plans for each product - 3 plans: Basic, Professional, Premium
    const baseDemoUrl = product.demoUrl || 'https://demo.example.com'
    
    // Get category-specific features based on product category
    const getCategoryFeatures = (categoryName: string | null) => {
      const categoryFeatures: Record<string, { basic: string[], professional: string[], premium: string[] }> = {
        'Yiyecek İçecek Sektörü': {
          basic: [
            'Temel sipariş yönetimi',
            'Masa takibi',
            'Temel raporlama',
            'Email desteği',
            '1 kullanıcı',
          ],
          professional: [
            'Basic planın tüm özellikleri',
            'Mutfak ekranı entegrasyonu',
            'Stok takip sistemi',
            'Çoklu şube desteği',
            'Gelişmiş raporlama ve analiz',
            'Öncelikli destek',
            '5 kullanıcı',
          ],
          premium: [
            'Professional planın tüm özellikleri',
            'Sınırsız şube yönetimi',
            'API entegrasyonu',
            'Özel raporlama ve dashboard',
            '7/24 öncelikli destek',
            'Özel eğitim ve danışmanlık',
            'Sınırsız kullanıcı',
            'Özel özellik talepleri',
          ],
        },
        'Güzellik Sektörü': {
          basic: [
            'Temel randevu yönetimi',
            'Müşteri kayıt sistemi',
            'Hizmet yönetimi',
            'Email desteği',
            '1 kullanıcı',
          ],
          professional: [
            'Basic planın tüm özellikleri',
            'Online randevu sistemi',
            'Personel yönetimi',
            'Çoklu şube desteği',
            'Gelir raporları',
            'SMS bildirimleri',
            '5 kullanıcı',
          ],
          premium: [
            'Professional planın tüm özellikleri',
            'Sınırsız şube yönetimi',
            'Müşteri sadakat programı',
            'API entegrasyonu',
            '7/24 öncelikli destek',
            'Özel eğitim ve danışmanlık',
            'Sınırsız kullanıcı',
            'Özel özellik talepleri',
          ],
        },
        'Sağlık Sektörü': {
          basic: [
            'Hasta kayıt sistemi',
            'Temel randevu yönetimi',
            'Tıbbi kayıt yönetimi',
            'Email desteği',
            '1 kullanıcı',
          ],
          professional: [
            'Basic planın tüm özellikleri',
            'Gelişmiş hasta takibi',
            'Reçete yönetimi',
            'Çoklu doktor desteği',
            'Detaylı raporlama',
            'KVKK uyumlu veri saklama',
            '5 kullanıcı',
          ],
          premium: [
            'Professional planın tüm özellikleri',
            'Sınırsız doktor ve hasta',
            'API entegrasyonu',
            'Özel raporlama ve dashboard',
            '7/24 öncelikli destek',
            'Özel eğitim ve danışmanlık',
            'Sınırsız kullanıcı',
            'Özel özellik talepleri',
          ],
        },
        'Eğitim Sektörü': {
          basic: [
            'Öğrenci kayıt sistemi',
            'Temel ders yönetimi',
            'Devam takibi',
            'Email desteği',
            '1 kullanıcı',
          ],
          professional: [
            'Basic planın tüm özellikleri',
            'Not yönetim sistemi',
            'Veli iletişim sistemi',
            'Çoklu sınıf desteği',
            'Gelişmiş raporlama',
            'Mobil uygulama',
            '5 kullanıcı',
          ],
          premium: [
            'Professional planın tüm özellikleri',
            'Sınırsız öğrenci ve sınıf',
            'API entegrasyonu',
            'Özel raporlama ve dashboard',
            '7/24 öncelikli destek',
            'Özel eğitim ve danışmanlık',
            'Sınırsız kullanıcı',
            'Özel özellik talepleri',
          ],
        },
        'Otomotiv Sektörü': {
          basic: [
            'Araç kayıt sistemi',
            'Temel hizmet yönetimi',
            'Randevu takibi',
            'Email desteği',
            '1 kullanıcı',
          ],
          professional: [
            'Basic planın tüm özellikleri',
            'Paket yönetimi',
            'Personel yönetimi',
            'Çoklu şube desteği',
            'Gelir raporları',
            'Mobil uygulama',
            '5 kullanıcı',
          ],
          premium: [
            'Professional planın tüm özellikleri',
            'Sınırsız şube yönetimi',
            'API entegrasyonu',
            'Özel raporlama ve dashboard',
            '7/24 öncelikli destek',
            'Özel eğitim ve danışmanlık',
            'Sınırsız kullanıcı',
            'Özel özellik talepleri',
          ],
        },
        'Perakende Sektörü': {
          basic: [
            'Temel satış yönetimi',
            'Stok takibi',
            'Müşteri kayıt sistemi',
            'Email desteği',
            '1 kullanıcı',
          ],
          professional: [
            'Basic planın tüm özellikleri',
            'POS entegrasyonu',
            'Kampanya yönetimi',
            'Çoklu şube desteği',
            'Gelişmiş raporlama',
            'Barkod sistemi',
            '5 kullanıcı',
          ],
          premium: [
            'Professional planın tüm özellikleri',
            'Sınırsız şube yönetimi',
            'API entegrasyonu',
            'Özel raporlama ve dashboard',
            '7/24 öncelikli destek',
            'Özel eğitim ve danışmanlık',
            'Sınırsız kullanıcı',
            'Özel özellik talepleri',
          ],
        },
      }
      
      const defaultFeatures = {
        basic: [
          'Temel yönetim özellikleri',
          'Kullanıcı kayıt sistemi',
          'Temel raporlama',
          'Email desteği',
          '1 kullanıcı',
        ],
        professional: [
          'Basic planın tüm özellikleri',
          'Gelişmiş yönetim özellikleri',
          'Çoklu şube desteği',
          'Gelişmiş raporlama ve analiz',
          'Öncelikli destek',
          '5 kullanıcı',
        ],
        premium: [
          'Professional planın tüm özellikleri',
          'Sınırsız şube yönetimi',
          'API entegrasyonu',
          'Özel raporlama ve dashboard',
          '7/24 öncelikli destek',
          'Özel eğitim ve danışmanlık',
          'Sınırsız kullanıcı',
          'Özel özellik talepleri',
        ],
      }
      
      if (categoryName && categoryFeatures[categoryName]) {
        return categoryFeatures[categoryName]
      }
      return defaultFeatures
    }
    
    const categoryName = product.category?.name || null
    const features = getCategoryFeatures(categoryName)
    
    const plans = [
      {
        name: 'Basic',
        tier: 'BASIC' as const,
        billingPeriod: 'MONTHLY' as const,
        price: 299.00,
        currency: 'TRY',
        description: 'Küçük işletmeler için ideal başlangıç planı',
        demoUrl: `${baseDemoUrl}/basic`,
        features: {
          features: features.basic,
        },
        isActive: true,
      },
      {
        name: 'Professional',
        tier: 'PROFESSIONAL' as const,
        billingPeriod: 'MONTHLY' as const,
        price: 599.00,
        currency: 'TRY',
        description: 'Orta ölçekli işletmeler için gelişmiş özellikler',
        demoUrl: `${baseDemoUrl}/professional`,
        features: {
          features: features.professional,
        },
        isActive: true,
      },
      {
        name: 'Premium',
        tier: 'PREMIUM' as const,
        billingPeriod: 'MONTHLY' as const,
        price: 999.00,
        currency: 'TRY',
        description: 'Büyük işletmeler ve çoklu şube için kurumsal çözüm',
        demoUrl: `${baseDemoUrl}/premium`,
        features: {
          features: features.premium,
        },
        isActive: true,
      },
    ]

    for (const planData of plans) {
      const existingPlan = await prisma.plan.findFirst({
        where: {
          productId: product.id,
          tier: planData.tier,
        },
      })

      if (!existingPlan) {
        await prisma.plan.create({
          data: {
            ...planData,
            productId: product.id,
          },
        })
      } else {
        // Update existing plan with new fields
        await prisma.plan.update({
          where: { id: existingPlan.id },
          data: {
            name: planData.name,
            tier: planData.tier,
            demoUrl: planData.demoUrl,
            features: planData.features,
            description: planData.description,
          },
        })
      }
    }
    console.log('Plans created for:', product.name)
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

