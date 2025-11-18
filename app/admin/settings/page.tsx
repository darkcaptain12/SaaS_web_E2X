import { prisma } from '@/lib/prisma'
import SettingsForm from '@/components/SettingsForm'

async function getSettings() {
  let settings = await prisma.settings.findUnique({
    where: { id: 'settings' },
  })

  if (!settings) {
    // İlk kez oluştur
    settings = await prisma.settings.create({
      data: {
        id: 'settings',
      },
    })
  }

  return settings
}

export default async function AdminSettingsPage() {
  const settings = await getSettings()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white shadow-lg">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">Tasarım Ayarları</h1>
          <p className="text-white/90 text-lg">Site görünümü ve genel ayarları yönetin</p>
        </div>
      </div>

      {/* Settings Form */}
      <SettingsForm settings={settings} />
    </div>
  )
}

