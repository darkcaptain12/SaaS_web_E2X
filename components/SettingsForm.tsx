'use client'

import { useState, useEffect } from 'react'
import { Settings } from '@prisma/client'

interface SettingsFormProps {
  settings: Settings
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor || '#F97316')
  const [secondaryColor, setSecondaryColor] = useState(settings.secondaryColor || '#EA580C')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        body: formData,
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          window.location.reload()
        }, 1500)
      } else {
        const data = await response.json()
        setError(data.error || 'Ayarlar güncellenirken bir hata oluştu')
      }
    } catch (err) {
      setError('Ayarlar güncellenirken bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Sync color inputs
  useEffect(() => {
    const primaryInput = document.getElementById('primaryColor') as HTMLInputElement
    const secondaryInput = document.getElementById('secondaryColor') as HTMLInputElement
    if (primaryInput) primaryInput.value = primaryColor
    if (secondaryInput) secondaryInput.value = secondaryColor
  }, [primaryColor, secondaryColor])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Form */}
      <div className="lg:col-span-2">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 space-y-8"
        >
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <span>❌</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <span>✅</span>
              <span>Ayarlar başarıyla güncellendi! Sayfa yenileniyor...</span>
            </div>
          )}

      {/* Genel Ayarlar */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">⚙️</span>
          Genel Ayarlar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="siteName" className="block text-sm font-semibold text-gray-700">
              Site Adı <span className="text-red-500">*</span>
            </label>
            <input
              id="siteName"
              name="siteName"
              required
              defaultValue={settings.siteName}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="İş Otomasyon"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label htmlFor="siteDescription" className="block text-sm font-semibold text-gray-700">
              Site Açıklaması
            </label>
            <textarea
              id="siteDescription"
              name="siteDescription"
              rows={3}
              defaultValue={settings.siteDescription || ''}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="Sitenizin kısa açıklaması..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="logoText" className="block text-sm font-semibold text-gray-700">
              Logo Metni
            </label>
            <input
              id="logoText"
              name="logoText"
              defaultValue={settings.logoText || ''}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="İş Otomasyon"
            />
            <p className="text-xs text-gray-500">Logo yerine metin kullanılacaksa</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="logoUrl" className="block text-sm font-semibold text-gray-700">
              Logo URL
            </label>
            <input
              id="logoUrl"
              name="logoUrl"
              type="url"
              defaultValue={settings.logoUrl || ''}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="https://example.com/logo.png"
            />
          </div>
        </div>
      </div>

      {/* Renk Ayarları */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">🎨</span>
          Renk Ayarları
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="primaryColor" className="block text-sm font-semibold text-gray-700">
              Ana Renk (Hex) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                id="primaryColor"
                name="primaryColor"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-16 h-12 rounded-xl border-2 border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => {
                  const value = e.target.value
                  if (/^#[0-9A-F]{6}$/i.test(value) || value === '') {
                    setPrimaryColor(value)
                  }
                }}
                className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-mono"
                placeholder="#F97316"
                pattern="^#[0-9A-F]{6}$"
              />
            </div>
            <p className="text-xs text-gray-500">Ana renk (butonlar, linkler, vurgular için kullanılır)</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="secondaryColor" className="block text-sm font-semibold text-gray-700">
              İkincil Renk (Hex)
            </label>
            <div className="flex items-center gap-3">
              <input
                id="secondaryColor"
                name="secondaryColor"
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-16 h-12 rounded-xl border-2 border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => {
                  const value = e.target.value
                  if (/^#[0-9A-F]{6}$/i.test(value) || value === '') {
                    setSecondaryColor(value)
                  }
                }}
                className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-mono"
                placeholder="#EA580C"
                pattern="^#[0-9A-F]{6}$"
              />
            </div>
            <p className="text-xs text-gray-500">İkincil renk (gradient ve vurgular için)</p>
          </div>
        </div>
      </div>

      {/* İletişim Bilgileri */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">📞</span>
          İletişim Bilgileri
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="whatsappPhone" className="block text-sm font-semibold text-gray-700">
              WhatsApp Telefon
            </label>
            <input
              id="whatsappPhone"
              name="whatsappPhone"
              defaultValue={settings.whatsappPhone || ''}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="+905551234567"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contactEmail" className="block text-sm font-semibold text-gray-700">
              E-posta
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              defaultValue={settings.contactEmail || ''}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="info@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contactPhone" className="block text-sm font-semibold text-gray-700">
              Telefon
            </label>
            <input
              id="contactPhone"
              name="contactPhone"
              defaultValue={settings.contactPhone || ''}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="+90 555 123 45 67"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label htmlFor="contactAddress" className="block text-sm font-semibold text-gray-700">
              Adres
            </label>
            <textarea
              id="contactAddress"
              name="contactAddress"
              rows={2}
              defaultValue={settings.contactAddress || ''}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="İş adresi..."
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label htmlFor="whatsappMessage" className="block text-sm font-semibold text-gray-700">
              WhatsApp Mesaj Şablonu
            </label>
            <textarea
              id="whatsappMessage"
              name="whatsappMessage"
              rows={2}
              defaultValue={settings.whatsappMessage || ''}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="Merhaba, {page} sayfasından size ulaşıyorum..."
            />
            <p className="text-xs text-gray-500">{"{page}"} otomatik olarak sayfa adresi ile değiştirilir</p>
          </div>
        </div>
      </div>

      {/* Sosyal Medya */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">🌐</span>
          Sosyal Medya
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="socialFacebook" className="block text-sm font-semibold text-gray-700">
              Facebook URL
            </label>
            <input
              id="socialFacebook"
              name="socialFacebook"
              type="url"
              defaultValue={settings.socialFacebook || ''}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="https://facebook.com/..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="socialInstagram" className="block text-sm font-semibold text-gray-700">
              Instagram URL
            </label>
            <input
              id="socialInstagram"
              name="socialInstagram"
              type="url"
              defaultValue={settings.socialInstagram || ''}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="https://instagram.com/..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="socialTwitter" className="block text-sm font-semibold text-gray-700">
              Twitter/X URL
            </label>
            <input
              id="socialTwitter"
              name="socialTwitter"
              type="url"
              defaultValue={settings.socialTwitter || ''}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="https://twitter.com/..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="socialLinkedIn" className="block text-sm font-semibold text-gray-700">
              LinkedIn URL
            </label>
            <input
              id="socialLinkedIn"
              name="socialLinkedIn"
              type="url"
              defaultValue={settings.socialLinkedIn || ''}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="https://linkedin.com/..."
            />
          </div>
        </div>
      </div>

      {/* Footer Ayarları */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">📄</span>
          Footer Ayarları
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="footerDescription" className="block text-sm font-semibold text-gray-700">
              Footer Açıklaması
            </label>
            <textarea
              id="footerDescription"
              name="footerDescription"
              rows={3}
              defaultValue={settings.footerDescription || ''}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="Footer'da görünecek açıklama metni..."
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label htmlFor="footerCopyright" className="block text-sm font-semibold text-gray-700">
              Copyright Metni
            </label>
            <input
              id="footerCopyright"
              name="footerCopyright"
              defaultValue={settings.footerCopyright || ''}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="© 2024 İş Otomasyon. Tüm hakları saklıdır."
            />
          </div>
        </div>
      </div>

      {/* SEO Ayarları */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">🔍</span>
          SEO Ayarları
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="metaTitle" className="block text-sm font-semibold text-gray-700">
              Meta Title
            </label>
            <input
              id="metaTitle"
              name="metaTitle"
              defaultValue={settings.metaTitle || ''}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="İş Otomasyon - Profesyonel Otomasyon Çözümleri"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label htmlFor="metaDescription" className="block text-sm font-semibold text-gray-700">
              Meta Description
            </label>
            <textarea
              id="metaDescription"
              name="metaDescription"
              rows={2}
              defaultValue={settings.metaDescription || ''}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="Tüm sektörler için profesyonel otomasyon çözümleri..."
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label htmlFor="metaKeywords" className="block text-sm font-semibold text-gray-700">
              Meta Keywords
            </label>
            <input
              id="metaKeywords"
              name="metaKeywords"
              defaultValue={settings.metaKeywords || ''}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="otomasyon, iş yönetimi, saas, panel"
            />
            <p className="text-xs text-gray-500">Virgülle ayrılmış anahtar kelimeler</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="faviconUrl" className="block text-sm font-semibold text-gray-700">
              Favicon URL
            </label>
            <input
              id="faviconUrl"
              name="faviconUrl"
              type="url"
              defaultValue={settings.faviconUrl || ''}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="https://example.com/favicon.ico"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="ogImageUrl" className="block text-sm font-semibold text-gray-700">
              Open Graph Image URL
            </label>
            <input
              id="ogImageUrl"
              name="ogImageUrl"
              type="url"
              defaultValue={settings.ogImageUrl || ''}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="https://example.com/og-image.png"
            />
          </div>
        </div>
      </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Ayarları Kaydet</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 sticky top-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>👁️</span>
            <span>Canlı Önizleme</span>
          </h3>
          
          {/* Color Preview */}
          <div className="space-y-4 mb-6">
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Ana Renk</p>
              <div 
                className="w-full h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: primaryColor }}
              >
                {primaryColor}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">İkincil Renk</p>
              <div 
                className="w-full h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: secondaryColor || primaryColor }}
              >
                {secondaryColor || primaryColor}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Gradient Önizleme</p>
              <div 
                className="w-full h-12 rounded-xl border-2 border-gray-200"
                style={{ 
                  background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor || primaryColor})` 
                }}
              ></div>
            </div>
          </div>

          {/* Button Preview */}
          <div className="space-y-3 mb-6">
            <p className="text-xs font-semibold text-gray-600 mb-2">Buton Önizleme</p>
            <button
              type="button"
              className="w-full px-4 py-2 rounded-xl text-white font-semibold text-sm transition-all"
              style={{ 
                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor || primaryColor})` 
              }}
            >
              Örnek Buton
            </button>
            <button
              type="button"
              className="w-full px-4 py-2 rounded-xl border-2 font-semibold text-sm transition-all"
              style={{ 
                borderColor: primaryColor,
                color: primaryColor
              }}
            >
              Kenarlıklı Buton
            </button>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>💡 İpucu:</strong> Renk değişiklikleri kaydedildikten sonra sayfa yenilenecek ve yeni renkler uygulanacaktır.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

