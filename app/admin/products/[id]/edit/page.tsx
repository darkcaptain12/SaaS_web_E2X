'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

export default function AdminEditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [product, setProduct] = useState<any>(null)
  const [categories, setCategories] = useState<Array<{ id: string; name: string; icon: string }>>([])
  const [plans, setPlans] = useState<Array<{
    id?: string
    name: string
    billingPeriod: 'MONTHLY' | 'YEARLY' | 'LIFETIME'
    price: string
    currency: string
    description: string
    demoUrl: string
    isActive: boolean
  }>>([])

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch categories
        const categoriesResponse = await fetch('/api/admin/categories')
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setCategories(categoriesData.categories || [])
        }

        // Fetch product
        const productResponse = await fetch(`/api/admin/products/${productId}`)
        if (productResponse.ok) {
          const productData = await productResponse.json()
          setProduct(productData.product)
          
          // Convert plans to form format
          const formattedPlans = productData.product.plans.map((plan: any) => ({
            id: plan.id,
            name: plan.name,
            billingPeriod: plan.billingPeriod,
            price: plan.price.toString(),
            currency: plan.currency,
            description: plan.description || '',
            demoUrl: plan.demoUrl || '',
            isActive: plan.isActive,
          }))
          
          setPlans(formattedPlans.length > 0 ? formattedPlans : [
            { name: '', billingPeriod: 'MONTHLY' as const, price: '', currency: 'TRY', description: '', demoUrl: '', isActive: true },
          ])
        } else {
          setError('Ürün bulunamadı')
        }
      } catch (err) {
        setError('Ürün yüklenirken bir hata oluştu')
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchData()
    }
  }, [productId])

  const addPlan = () => {
    setPlans([...plans, { name: '', billingPeriod: 'MONTHLY' as const, price: '', currency: 'TRY', description: '', demoUrl: '', isActive: true }])
  }

  const removePlan = (index: number) => {
    if (plans.length > 1) {
      setPlans(plans.filter((_, i) => i !== index))
    }
  }

  const updatePlan = (index: number, field: string, value: any) => {
    const updated = [...plans]
    updated[index] = { ...updated[index], [field]: value }
    setPlans(updated)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    // Remove existing plan data and add fresh plan data in correct order
    // This ensures planId, planName, etc. are in sync
    formData.delete('planId')
    formData.delete('planName')
    formData.delete('planBillingPeriod')
    formData.delete('planPrice')
    formData.delete('planCurrency')
    formData.delete('planDescription')
    formData.delete('planDemoUrl')
    formData.delete('planIsActive')

    // Add plan data in correct order
    plans.forEach((plan) => {
      if (plan.id) {
        formData.append('planId', plan.id)
      } else {
        formData.append('planId', '') // Empty string for new plans
      }
      formData.append('planName', plan.name)
      formData.append('planBillingPeriod', plan.billingPeriod)
      formData.append('planPrice', plan.price.toString())
      formData.append('planCurrency', plan.currency)
      formData.append('planDescription', plan.description || '')
      formData.append('planDemoUrl', plan.demoUrl || '')
      formData.append('planIsActive', plan.isActive ? 'on' : 'off')
    })

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        body: formData,
      })

      if (response.ok) {
        router.push('/admin/products')
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || 'Ürün güncellenirken bir hata oluştu')
      }
    } catch (err) {
      setError('Ürün güncellenirken bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 font-medium">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl">
          {error}
        </div>
        <Link
          href="/admin/products"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Ürün listesine dön
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ürünü Düzenle</h1>
          <p className="text-gray-600 text-sm mt-1">
            Ürün bilgilerini ve fiyat planlarını güncelleyin.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Ürün listesine dön
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
        {/* Ürün Bilgileri Bölümü */}
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">📦</span>
            Ürün Bilgileri
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ürün Adı */}
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                Ürün Adı <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                required
                defaultValue={product?.name}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="Örn: Yönetim Paneli"
              />
            </div>

            {/* Kategori */}
            <div className="space-y-2">
              <label htmlFor="categoryId" className="block text-sm font-semibold text-gray-700">
                Kategori <span className="text-red-500">*</span>
              </label>
              {categories.length > 0 ? (
                <select
                  id="categoryId"
                  name="categoryId"
                  required
                  defaultValue={product?.categoryId || ''}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                >
                  <option value="">Kategori seçin...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full rounded-xl border-2 border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
                  Henüz kategori eklenmemiş. Önce{' '}
                  <Link href="/admin/categories/new" className="underline font-semibold">
                    kategori ekleyin
                  </Link>
                  .
                </div>
              )}
            </div>

            {/* Deneme Süresi */}
            <div className="space-y-2">
              <label htmlFor="trialDays" className="block text-sm font-semibold text-gray-700">
                Ücretsiz Deneme Süresi (gün)
              </label>
              <input
                id="trialDays"
                name="trialDays"
                type="number"
                min={1}
                defaultValue={product?.trialDays || 7}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>

            {/* Kısa Açıklama */}
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="shortDescription" className="block text-sm font-semibold text-gray-700">
                Kısa Açıklama <span className="text-red-500">*</span>
              </label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                required
                rows={2}
                defaultValue={product?.shortDescription}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="Ürünün kısa açıklaması (kartlarda görünecek)"
              />
            </div>

            {/* Açıklama */}
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                Detaylı Açıklama <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                defaultValue={product?.description}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="Ürünün detaylı açıklaması..."
              />
            </div>

            {/* Aktif / Pasif */}
            <div className="md:col-span-2 flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                defaultChecked={product?.isActive ?? true}
                className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Ürün aktif olsun (satış sayfasında listelensin)
              </label>
            </div>
          </div>
        </div>

        {/* Demo Bilgileri Bölümü */}
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">🔐</span>
            Demo Bilgileri (Opsiyonel)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="demoUrl" className="block text-sm font-semibold text-gray-700">
                Demo URL
              </label>
              <input
                id="demoUrl"
                name="demoUrl"
                type="url"
                defaultValue={product?.demoUrl || ''}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="https://demo.example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="demoUsername" className="block text-sm font-semibold text-gray-700">
                Demo Kullanıcı Adı
              </label>
              <input
                id="demoUsername"
                name="demoUsername"
                defaultValue={product?.demoUsername || ''}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="demo"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="demoPassword" className="block text-sm font-semibold text-gray-700">
                Demo Şifre
              </label>
              <input
                id="demoPassword"
                name="demoPassword"
                type="password"
                defaultValue={product?.demoPassword || ''}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="demo123"
              />
            </div>
          </div>
        </div>

        {/* Fiyat Planları Bölümü */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">💰</span>
              Fiyat Planları
            </h2>
            <button
              type="button"
              onClick={addPlan}
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <span>+</span>
              <span>Plan Ekle</span>
            </button>
          </div>

          <div className="space-y-4">
            {plans.map((plan, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Plan {index + 1}</h3>
                  {plans.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePlan(index)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Kaldır
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {plan.id && (
                    <input type="hidden" name="planId" value={plan.id} />
                  )}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Plan Adı <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="planName"
                      required
                      value={plan.name}
                      onChange={(e) => updatePlan(index, 'name', e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="Temel"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Faturalama <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="planBillingPeriod"
                      required
                      value={plan.billingPeriod}
                      onChange={(e) => updatePlan(index, 'billingPeriod', e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    >
                      <option value="MONTHLY">Aylık</option>
                      <option value="YEARLY">Yıllık</option>
                      <option value="LIFETIME">Ömür Boyu</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Fiyat <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        name="planPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={plan.price}
                        onChange={(e) => updatePlan(index, 'price', e.target.value)}
                        className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        placeholder="299.00"
                      />
                      <select
                        name="planCurrency"
                        value={plan.currency}
                        onChange={(e) => updatePlan(index, 'currency', e.target.value)}
                        className="rounded-xl border-2 border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      >
                        <option value="TRY">₺</option>
                        <option value="USD">$</option>
                        <option value="EUR">€</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Durum
                    </label>
                    <div className="flex items-center gap-3 p-2">
                      <input
                        name="planIsActive"
                        type="checkbox"
                        checked={plan.isActive}
                        onChange={(e) => updatePlan(index, 'isActive', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Aktif</span>
                    </div>
                  </div>

                  <div className="md:col-span-2 lg:col-span-4 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Açıklama
                    </label>
                    <input
                      name="planDescription"
                      value={plan.description}
                      onChange={(e) => updatePlan(index, 'description', e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="Küçük işletmeler için ideal"
                    />
                  </div>

                  <div className="md:col-span-2 lg:col-span-4 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Demo URL (Opsiyonel)
                    </label>
                    <input
                      name="planDemoUrl"
                      type="url"
                      value={plan.demoUrl}
                      onChange={(e) => updatePlan(index, 'demoUrl', e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="https://demo.example.com"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Butonlar */}
        <div className="flex items-center justify-end space-x-4 pt-6">
          <Link
            href="/admin/products"
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
                <span>Güncelleniyor...</span>
              </>
            ) : (
              'Değişiklikleri Kaydet'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

