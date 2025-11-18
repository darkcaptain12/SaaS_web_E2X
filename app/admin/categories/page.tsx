import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import CategoriesTable from '@/components/CategoriesTable'

async function getCategories() {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold mb-2">Kategori Yönetimi</h1>
            <p className="text-white/90 text-lg">Sektör kategorilerini yönetin</p>
          </div>
          <Link
            href="/admin/categories/new"
            className="bg-white text-primary-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <span>+</span>
            <span>Yeni Kategori Ekle</span>
          </Link>
        </div>
      </div>

      {/* Categories Table */}
      <CategoriesTable data={categories} />
    </div>
  )
}

