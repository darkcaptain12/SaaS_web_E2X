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

  // Create sample products - 3 Main Panels
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
  ]

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    })
    console.log('Product created:', product.name)

    // Create plans for each product
    const plans = [
      {
        name: 'Temel',
        billingPeriod: 'MONTHLY' as const,
        price: 299.00,
        currency: 'TRY',
        description: 'Küçük işletmeler için ideal',
        isActive: true,
      },
      {
        name: 'Profesyonel',
        billingPeriod: 'MONTHLY' as const,
        price: 599.00,
        currency: 'TRY',
        description: 'Orta ölçekli işletmeler için',
        isActive: true,
      },
      {
        name: 'Kurumsal',
        billingPeriod: 'MONTHLY' as const,
        price: 999.00,
        currency: 'TRY',
        description: 'Büyük işletmeler ve çoklu şube için',
        isActive: true,
      },
    ]

    for (const planData of plans) {
      const existingPlan = await prisma.plan.findFirst({
        where: {
          productId: product.id,
          name: planData.name,
        },
      })

      if (!existingPlan) {
        await prisma.plan.create({
          data: {
            ...planData,
            productId: product.id,
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

