# Hızlı Kurulum Rehberi

## 1. Bağımlılıkları Yükleyin

```bash
npm install
```

## 2. Veritabanı Kurulumu

PostgreSQL veritabanınızı hazırlayın ve `.env` dosyasında `DATABASE_URL` değişkenini ayarlayın.

```bash
# Prisma client'ı oluştur
npm run db:generate

# Veritabanı şemasını uygula
npm run db:push

# Örnek verileri yükle (opsiyonel)
npm run db:seed
```

**Not:** Seed script'i çalıştırdığınızda:
- Admin kullanıcı oluşturulur: `admin@example.com` / `admin123`
- 4 örnek ürün ve planlar oluşturulur

## 3. Ortam Değişkenleri

`.env` dosyasını oluşturun ve gerekli değişkenleri ekleyin. `.env.example` dosyasını referans alabilirsiniz.

**Önemli:**
- `NEXTAUTH_SECRET`: Güçlü bir rastgele string kullanın (ör: `openssl rand -base64 32`)
- `NEXT_PUBLIC_WHATSAPP_PHONE`: WhatsApp butonu için telefon numarası (client-side erişim)
- PayTR bilgileri: Gerçek entegrasyon için PayTR hesabınızdan alın

## 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## 5. İlk Giriş

Seed script'i çalıştırdıysanız:
- Email: `admin@example.com`
- Şifre: `admin123`

## PayTR Entegrasyonu

PayTR entegrasyonu şu anda placeholder kod içermektedir. Gerçek entegrasyon için:

1. `lib/paytr.ts` dosyasını inceleyin
2. PayTR API dokümantasyonuna göre hash hesaplama ve parametreleri güncelleyin
3. Test ortamında deneyin

## Sorun Giderme

### Veritabanı Bağlantı Hatası
- PostgreSQL servisinin çalıştığından emin olun
- `DATABASE_URL` formatını kontrol edin
- Veritabanının oluşturulduğundan emin olun

### NextAuth Hatası
- `NEXTAUTH_SECRET` ve `NEXTAUTH_URL` değişkenlerinin ayarlandığından emin olun
- Geliştirme ortamında `NEXTAUTH_URL` genellikle `http://localhost:3000` olmalıdır

### Build Hatası
- TypeScript hatalarını kontrol edin: `npm run lint`
- Prisma client'ın oluşturulduğundan emin olun: `npm run db:generate`

