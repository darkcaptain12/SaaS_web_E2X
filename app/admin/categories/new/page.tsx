'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const ICON_OPTIONS = [
  { value: '🍽️', label: 'Yiyecek İçecek' },
  { value: '💄', label: 'Güzellik' },
  { value: '🚗', label: 'Otomotiv' },
  { value: '🏥', label: 'Sağlık' },
  { value: '🏫', label: 'Eğitim' },
  { value: '🏢', label: 'İnşaat' },
  { value: '🛍️', label: 'Perakende' },
  { value: '🏨', label: 'Turizm' },
  { value: '💼', label: 'Hukuk' },
  { value: '💰', label: 'Finans' },
  { value: '📱', label: 'Teknoloji' },
  { value: '🎨', label: 'Tasarım' },
  { value: '🎬', label: 'Medya' },
  { value: '⚽', label: 'Spor' },
  { value: '🌾', label: 'Tarım' },
  { value: '🏭', label: 'Üretim' },
  { value: '🚚', label: 'Lojistik' },
  { value: '🔧', label: 'Hizmet' },
]

export default function AdminNewCategoryPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        router.push('/admin/categories')
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || 'Kategori eklenirken bir hata oluştu')
      }
    } catch (err) {
      setError('Kategori eklenirken bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Yeni Kategori Ekle</h1>
          <p className="text-gray-600 text-sm mt-1">
            Sektör kategorisi ekleyin. Kategoriler ürünlere atanabilir.
          </p>
        </div>

        <Link
          href="/admin/categories"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Kategori listesine dön
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 space-y-8 max-w-4xl"
      >
        {/* Kategori Bilgileri */}
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">📁</span>
            Kategori Bilgileri
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kategori Adı */}
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                Kategori Adı <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                required
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="Örn: Yiyecek İçecek Sektörü"
              />
            </div>

            {/* İkon Seçimi */}
            <div className="space-y-2">
              <label htmlFor="icon" className="block text-sm font-semibold text-gray-700">
                İkon <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-6 gap-2">
                {ICON_OPTIONS.map((icon) => (
                  <label
                    key={icon.value}
                    className="relative cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="icon"
                      value={icon.value}
                      required
                      className="peer sr-only"
                      defaultChecked={icon.value === '🍽️'}
                    />
                    <div className="w-full aspect-square rounded-xl border-2 border-gray-200 flex items-center justify-center text-2xl transition-all peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:scale-110 group-hover:border-primary-300 group-hover:bg-primary-50">
                      {icon.value}
                    </div>
                    <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {icon.label}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-8">Yukarıdaki ikonlardan birini seçin</p>
            </div>

            {/* Renk (Opsiyonel) */}
            <div className="space-y-2">
              <label htmlFor="color" className="block text-sm font-semibold text-gray-700">
                Renk (Opsiyonel)
              </label>
              <input
                id="color"
                name="color"
                type="text"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="Örn: from-blue-500 to-cyan-500"
              />
              <p className="text-xs text-gray-500">Tailwind gradient class (örn: from-blue-500 to-cyan-500)</p>
            </div>

            {/* Açıklama */}
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                Açıklama
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="Kategori hakkında kısa açıklama..."
              />
            </div>

            {/* Aktif / Pasif */}
            <div className="md:col-span-2 flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                defaultChecked
                className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Kategori aktif olsun (ürün eklerken görünsün)
              </label>
            </div>
          </div>
        </div>

        {/* Butonlar */}
        <div className="flex items-center justify-end space-x-4 pt-6">
          <Link
            href="/admin/categories"
            className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
          >
            İptal
          </Link>
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
              'Kategoriyi Kaydet'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

