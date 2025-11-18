# E2X - İş Otomasyon Panelleri SaaS Platformu

Modern, ölçeklenebilir ve kullanıcı dostu bir SaaS (Software as a Service) platformu. Tüm sektörler için profesyonel otomasyon panelleri sunan, Next.js 14 ve TypeScript ile geliştirilmiş tam özellikli bir web uygulaması.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue)

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Teknoloji Stack](#-teknoloji-stack)
- [Kurulum](#-kurulum)
- [Yapılandırma](#-yapılandırma)
- [Proje Yapısı](#-proje-yapısı)
- [Veritabanı](#-veritabanı)
- [API Endpoints](#-api-endpoints)
- [Kullanım](#-kullanım)
- [Geliştirme](#-geliştirme)
- [Deployment](#-deployment)
- [İletişim](#-iletişim)
- [Lisans](#-lisans)

## ✨ Özellikler

### 🎯 Halka Açık Özellikler
- **Modern Ana Sayfa**: Hero bölümü, ürün kartları, nasıl çalışır, faydalar ve SSS
- **Ürün Kataloğu**: Kategori filtreleme ile ürün listesi
- **Ürün Detay Sayfaları**: Detaylı ürün bilgileri, planlar ve demo erişimi
- **Fiyatlandırma Sayfası**: Plan karşılaştırma tablosu
- **Blog Sayfası**: İçerik yönetimi için hazır yapı
- **İletişim Sayfası**: Detaylı iletişim bilgileri
- **Gizlilik Politikası**: KVKK uyumlu gizlilik politikası
- **Kullanım Şartları**: Kapsamlı kullanım şartları

### 👤 Kullanıcı Paneli
- **Dashboard**: Genel bakış, istatistikler ve hızlı erişim
- **Deneme Yönetimi**: 
  - 7 günlük ücretsiz deneme başlatma
  - Aktif denemeleri görüntüleme
  - Deneme geçmişi
- **Abonelik Yönetimi**:
  - Aktif abonelikleri görüntüleme
  - Abonelik iptal etme
  - Sonraki ödeme tarihleri
- **Faturalama**:
  - Ödeme geçmişi
  - PayTR ile güvenli ödeme
  - Fatura detayları

### 🔐 Yönetim Paneli
- **Genel Bakış**: 
  - Toplam kullanıcı sayısı
  - Aktif denemeler
  - Abonelik istatistikleri
  - MRR (Monthly Recurring Revenue) takibi
- **Kullanıcı Yönetimi**: Tüm kullanıcıları görüntüleme ve yönetme
- **Ürün Yönetimi**: 
  - Ürün ekleme/düzenleme
  - Plan yönetimi
  - Kategori yönetimi
- **Deneme Yönetimi**: Tüm denemeleri görüntüleme ve filtreleme
- **Abonelik Yönetimi**: Abonelik durumlarını takip etme
- **Ödeme Yönetimi**: Ödeme geçmişi ve durum takibi
- **Site Ayarları**: 
  - Site adı, logo, renkler
  - İletişim bilgileri
  - SEO ayarları
  - Sosyal medya linkleri

### 💳 Ödeme Sistemi
- **PayTR Entegrasyonu**: Güvenli ödeme altyapısı
- **Otomatik Abonelik**: Ödeme sonrası otomatik abonelik oluşturma
- **Deneme Dönüşümü**: Deneme süresinden aboneliğe geçiş
- **Ödeme Geçmişi**: Detaylı ödeme kayıtları

### 🎁 Deneme Sistemi
- **7 Günlük Ücretsiz Deneme**: Tüm ürünlerde
- **Tek Aktif Deneme**: Aynı ürün için sadece bir aktif deneme
- **Otomatik Süre Dolma**: Cron job ile otomatik kontrol
- **Durum Takibi**: ACTIVE, EXPIRED, CONVERTED, CANCELLED

### 💬 Destek
- **WhatsApp Butonu**: Tüm sayfalarda sabit konum
- **7/24 Destek**: WhatsApp üzerinden destek
- **Otomatik Mesaj**: Mevcut sayfa bilgisi ile mesaj

## 🛠 Teknoloji Stack

### Frontend
- **Next.js 14.2.5** - React framework (App Router)
- **TypeScript 5.5.3** - Tip güvenliği
- **Tailwind CSS 3.4.4** - Utility-first CSS framework
- **Lucide React** - Modern icon kütüphanesi
- **React 18.3.1** - UI kütüphanesi

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js 4.24.7** - Kimlik doğrulama
- **Prisma 5.19.1** - Modern ORM
- **PostgreSQL** - İlişkisel veritabanı
- **bcryptjs 2.4.3** - Şifre hashleme

### Ödeme
- **PayTR** - Türkiye'nin önde gelen ödeme altyapısı

### Geliştirme Araçları
- **ESLint** - Kod kalitesi
- **TypeScript** - Tip kontrolü
- **Prisma Studio** - Veritabanı GUI
- **tsx** - TypeScript execution

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+ 
- PostgreSQL 12+
- npm veya yarn

### Adım 1: Projeyi Klonlayın

```bash
git clone <repository-url>
cd SaaS_web_E2X
```

### Adım 2: Bağımlılıkları Yükleyin

```bash
npm install
```

### Adım 3: Ortam Değişkenlerini Ayarlayın

`.env` dosyası oluşturun:

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:

```env
# Veritabanı
DATABASE_URL="postgresql://user:password@localhost:5432/saas_web_e2x?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"  # openssl rand -base64 32 ile oluşturun
NEXTAUTH_URL="http://localhost:3000"

# PayTR (Test/Production)
PAYTR_MERCHANT_ID="your-merchant-id"
PAYTR_MERCHANT_KEY="your-merchant-key"
PAYTR_MERCHANT_SALT="your-merchant-salt"
PAYTR_API_URL="https://www.paytr.com/odeme/api/get-token"

# WhatsApp
NEXT_PUBLIC_WHATSAPP_PHONE="905315661805"  # Client-side erişim
WHATSAPP_PHONE="905315661805"              # Server-side erişim

# Ortam
NODE_ENV="development"

# Vercel Cron Jobs (Opsiyonel)
CRON_SECRET="your-cron-secret-key-here"

# Site URL (Production)
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

### Adım 4: Veritabanını Hazırlayın

```bash
# Prisma client'ı oluştur
npm run db:generate

# Veritabanı şemasını uygula
npm run db:push

# Örnek verileri yükle (opsiyonel)
npm run db:seed
```

**Seed Script Bilgileri:**
- Admin kullanıcı: `admin@example.com` / `admin123`
- 6 kategori oluşturulur
- 3 örnek ürün ve planlar oluşturulur

### Adım 5: Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## ⚙️ Yapılandırma

### NextAuth Secret Oluşturma

```bash
openssl rand -base64 32
```

### PayTR Yapılandırması

1. PayTR hesabınızdan Merchant ID, Key ve Salt bilgilerini alın
2. `.env` dosyasına ekleyin
3. PayTR panelinde callback URL'yi ayarlayın: `https://yourdomain.com/api/paytr/callback`

### WhatsApp Yapılandırması

Telefon numarasını uluslararası formatta girin (90 ile başlayan, + işareti olmadan):
- Örnek: `905315661805`

## 📁 Proje Yapısı

```
SaaS_web_E2X/
├── app/                          # Next.js App Router
│   ├── api/                      # API endpoints
│   │   ├── admin/               # Admin API routes
│   │   ├── auth/                # Authentication routes
│   │   ├── cron/                # Cron job endpoints
│   │   ├── paytr/               # PayTR integration
│   │   ├── settings/            # Settings API
│   │   ├── subscriptions/       # Subscription management
│   │   └── trials/              # Trial management
│   ├── admin/                   # Admin panel pages
│   │   ├── categories/          # Category management
│   │   ├── payments/            # Payment management
│   │   ├── products/            # Product management
│   │   ├── settings/            # Site settings
│   │   ├── subscriptions/       # Subscription management
│   │   ├── trials/              # Trial management
│   │   └── users/               # User management
│   ├── auth/                    # Authentication pages
│   │   ├── login/              # Login page
│   │   └── register/            # Registration page
│   ├── dashboard/               # User dashboard
│   │   ├── billing/            # Billing pages
│   │   └── trials/              # Trial pages
│   ├── products/                # Product pages
│   │   └── [slug]/             # Product detail pages
│   ├── gizlilik-politikasi/    # Privacy policy
│   ├── iletisim/               # Contact page
│   ├── kullanim-sartlari/      # Terms of service
│   ├── pricing/                 # Pricing page
│   ├── blog/                    # Blog page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── AdminTable.tsx          # Reusable admin table
│   ├── BuyNowButton.tsx        # Payment button
│   ├── CancelSubscriptionButton.tsx
│   ├── CategoriesTable.tsx
│   ├── DashboardSidebar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── NavbarClient.tsx
│   ├── PaymentsTable.tsx
│   ├── PricingTable.tsx
│   ├── ProductCard.tsx
│   ├── ProductsTable.tsx
│   ├── SettingsForm.tsx
│   ├── StartTrialButton.tsx
│   ├── StatsCards.tsx
│   ├── SubscriptionsTable.tsx
│   ├── TrialsTable.tsx
│   ├── UsersTable.tsx
│   └── WhatsAppButton.tsx
├── lib/                         # Utility functions
│   ├── auth.ts                 # NextAuth configuration
│   ├── paytr.ts                # PayTR integration
│   ├── prisma.ts               # Prisma client
│   ├── settings.ts             # Settings management
│   ├── trials.ts               # Trial utilities
│   └── utils.ts                # General utilities
├── prisma/                      # Database
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Seed script
│   └── seed.config.ts          # Seed configuration
├── types/                       # TypeScript types
│   └── next-auth.d.ts          # NextAuth type definitions
├── middleware.ts                # Route protection
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── vercel.json                  # Vercel configuration
└── package.json                 # Dependencies
```

## 🗄️ Veritabanı

### Modeller

#### User
- Kullanıcı bilgileri
- Roller: USER, ADMIN
- İlişkiler: payments, subscriptions, trials

#### Category
- Ürün kategorileri
- İkon, renk, açıklama
- İlişkiler: products

#### Product
- Ürün/Sistem bilgileri
- Slug, açıklama, demo bilgileri
- Deneme günü (varsayılan 7)
- İlişkiler: category, plans, payments, subscriptions, trials

#### Plan
- Fiyatlandırma planları
- Billing Period: MONTHLY, YEARLY, LIFETIME
- Fiyat ve para birimi
- İlişkiler: product, payments, subscriptions, trials

#### Trial
- Deneme kayıtları
- Durum: ACTIVE, EXPIRED, CONVERTED, CANCELLED
- Başlangıç ve bitiş tarihleri
- İlişkiler: user, product, plan

#### Subscription
- Abonelik kayıtları
- Durum: ACTIVE, CANCELLED, EXPIRED, PAST_DUE
- Başlangıç, bitiş ve sonraki ödeme tarihleri
- İlişkiler: user, product, plan, payments

#### Payment
- Ödeme kayıtları
- Durum: PENDING, SUCCESS, FAILED
- PayTR transaction ID
- İlişkiler: user, subscription, product, plan

#### Settings
- Site ayarları
- Logo, renkler, iletişim bilgileri
- SEO ayarları
- Sosyal medya linkleri

### Veritabanı Yönetimi

```bash
# Prisma Studio'yu aç (GUI)
npm run db:studio

# Şema değişikliklerini uygula
npm run db:push

# Migration oluştur (production için)
npx prisma migrate dev --name migration_name

# Seed script çalıştır
npm run db:seed
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Admin
- `GET /api/admin/categories` - Kategorileri listele
- `POST /api/admin/categories` - Kategori oluştur
- `PUT /api/admin/categories/[id]` - Kategori güncelle
- `DELETE /api/admin/categories/[id]` - Kategori sil
- `GET /api/admin/products` - Ürünleri listele
- `POST /api/admin/products` - Ürün oluştur
- `PUT /api/admin/products/[id]` - Ürün güncelle
- `DELETE /api/admin/products/[id]` - Ürün sil
- `PUT /api/admin/settings` - Site ayarlarını güncelle

### Payments
- `POST /api/paytr/initiate` - Ödeme başlat
- `POST /api/paytr/callback` - PayTR callback handler

### Subscriptions
- `POST /api/subscriptions/cancel` - Abonelik iptal et

### Trials
- `POST /api/trials/start` - Deneme başlat

### Cron Jobs
- `GET /api/cron/expire-trials` - Süresi dolmuş denemeleri kontrol et

## 📖 Kullanım

### İlk Admin Kullanıcı

İlk kayıt olan kullanıcı otomatik olarak ADMIN rolüne sahip olur. Sonraki kullanıcılar USER rolü ile oluşturulur.

**Seed Script ile:**
- Email: `admin@example.com`
- Şifre: `admin123`

### Deneme Başlatma

1. Ürün detay sayfasına gidin
2. "7 Gün Ücretsiz Dene" butonuna tıklayın
3. Deneme otomatik olarak başlar
4. Dashboard'dan denemeyi takip edin

### Abonelik Oluşturma

1. Deneme süresinde veya sonrasında
2. Ürün detay sayfasından plan seçin
3. "Satın Al" butonuna tıklayın
4. PayTR ödeme sayfasına yönlendirilirsiniz
5. Ödeme sonrası otomatik abonelik oluşturulur

### Abonelik İptal

1. Dashboard > Faturalama sayfasına gidin
2. İptal etmek istediğiniz aboneliği bulun
3. "Aboneliği İptal Et" butonuna tıklayın
4. İptal sonraki faturalama döneminde geçerli olur

## 🛠️ Geliştirme

### Scripts

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Production sunucu
npm start

# Linting
npm run lint

# Veritabanı
npm run db:generate    # Prisma client oluştur
npm run db:push        # Şema değişikliklerini uygula
npm run db:studio      # Prisma Studio aç
npm run db:seed        # Örnek verileri yükle
```

### Kod Standartları

- TypeScript strict mode aktif
- ESLint kuralları uygulanır
- Component'ler PascalCase
- Dosyalar kebab-case
- Türkçe UI metinleri

### Yeni Özellik Ekleme

1. Feature branch oluşturun
2. Gerekli component'leri ekleyin
3. API endpoint'leri oluşturun
4. Veritabanı şemasını güncelleyin (gerekirse)
5. Test edin
6. Pull request oluşturun

## 🚀 Deployment

### Vercel Deployment

1. GitHub repository'yi bağlayın
2. Environment variables'ı ekleyin
3. Build command: `npm run build`
4. Output directory: `.next`
5. Deploy edin

### Environment Variables (Production)

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://yourdomain.com"
PAYTR_MERCHANT_ID="..."
PAYTR_MERCHANT_KEY="..."
PAYTR_MERCHANT_SALT="..."
NEXT_PUBLIC_WHATSAPP_PHONE="..."
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

### Cron Jobs (Vercel)

`vercel.json` dosyası zaten yapılandırılmıştır:
- Günlük deneme süresi kontrolü
- Gece yarısı (UTC) çalışır

## 🐛 Sorun Giderme

### Veritabanı Bağlantı Hatası
- PostgreSQL servisinin çalıştığından emin olun
- `DATABASE_URL` formatını kontrol edin
- Veritabanının oluşturulduğundan emin olun

### NextAuth Hatası
- `NEXTAUTH_SECRET` ve `NEXTAUTH_URL` ayarlı olmalı
- Geliştirme: `http://localhost:3000`
- Production: `https://yourdomain.com`

### Build Hatası
- TypeScript hatalarını kontrol edin: `npm run lint`
- Prisma client oluşturun: `npm run db:generate`
- Node.js versiyonunu kontrol edin (18+)

### PayTR Entegrasyonu
- Merchant bilgilerini kontrol edin
- Callback URL'yi PayTR panelinde ayarlayın
- Test ortamında deneyin

## 📞 İletişim

**E2X - İş Otomasyon Panelleri**

- **Telefon/WhatsApp**: [0531 566 18 05](tel:+905315661805)
- **E-posta**: [e2xldigital@gmail.com](mailto:e2xldigital@gmail.com)
- **Adres**: Nilüfer, Bursa, Türkiye
- **Vergi No**: 7860379549
- **Vergi Dairesi**: Çekirge

**Destek**: WhatsApp üzerinden 7/24 destek alabilirsiniz.

## 📄 Lisans

Bu proje özel bir projedir. Tüm hakları saklıdır.

© 2025 E2X - İş Otomasyon Panelleri. Tüm hakları saklıdır.

## 🙏 Teşekkürler

Bu projeyi kullandığınız için teşekkür ederiz. Sorularınız için iletişime geçmekten çekinmeyin.

---

**Not**: Bu README dosyası projenin güncel durumunu yansıtmaktadır. Güncellemeler için projeyi takip edin.
