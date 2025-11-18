import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getTrialsWithExpirationCheck } from '@/lib/trials'
import { formatDate, calculateRemainingDays } from '@/lib/utils'

async function getTrials(userId: string) {
  // This function automatically checks and expires trials before returning
  const trials = await getTrialsWithExpirationCheck(userId)
  // Ensure category is included
  return trials.map(trial => ({
    ...trial,
    product: {
      ...trial.product,
      category: trial.product.category || null,
    },
  }))
}

export default async function TrialsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null
  }

  const trials = await getTrials(session.user.id)

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-800',
      EXPIRED: 'bg-gray-100 text-gray-800',
      CONVERTED: 'bg-blue-100 text-blue-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }
    const labels = {
      ACTIVE: 'Aktif',
      EXPIRED: 'Süresi Doldu',
      CONVERTED: 'Dönüştürüldü',
      CANCELLED: 'İptal Edildi',
    }
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${styles[status as keyof typeof styles] || ''}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Denemelerim</h1>

      {trials.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ürün
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Başlangıç
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bitiş
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kalan Gün
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trials.map((trial) => (
                <tr key={trial.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {trial.product.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(trial.startDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(trial.endDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {trial.status === 'ACTIVE' ? (
                      <span className="font-semibold">
                        {calculateRemainingDays(trial.endDate)} gün
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(trial.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {trial.status === 'ACTIVE' && (
                      <Link
                        href={`/products/${trial.product.slug}`}
                        className="text-primary-600 hover:text-primary-700 mr-4"
                      >
                        Ürünü Gör
                      </Link>
                    )}
                    {trial.status === 'EXPIRED' && (
                      <Link
                        href={`/products/${trial.product.slug}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        Satın Al
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">Henüz deneme başlatmadınız</p>
          <Link
            href="/products"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Sistemleri Keşfet →
          </Link>
        </div>
      )}
    </div>
  )
}

