import { prisma } from '@/lib/prisma'
import ProductsTable from '@/components/ProductsTable'
import Link from 'next/link'

async function getProducts() {
  return await prisma.product.findMany({
    include: {
      category: true,
      plans: { where: { isActive: true } },
      _count: {
        select: { trials: true, subscriptions: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold mb-2">Ürün Yönetimi</h1>
            <p className="text-white/90 text-lg">Tüm otomasyon panellerini yönetin</p>
          </div>
          <Link
            href="/admin/products/new"
            className="bg-white text-primary-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <span>+</span>
            <span>Yeni Ürün Ekle</span>
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <ProductsTable data={products} />
    </div>
  )
}
