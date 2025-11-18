import { prisma } from './prisma'

/**
 * Get site settings (with caching for performance)
 */
let cachedSettings: any = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 60000 // 1 minute

export async function getSettings() {
  const now = Date.now()

  // Return cached settings if still valid
  if (cachedSettings && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedSettings
  }

  try {
    let settings = await prisma.settings.findUnique({
      where: { id: 'settings' },
    })

    if (!settings) {
      // Create default settings if they don't exist
      settings = await prisma.settings.create({
        data: {
          id: 'settings',
        },
      })
    }

    // Update cache
    cachedSettings = settings
    cacheTimestamp = now

    return settings
  } catch (error) {
    console.error('Error fetching settings:', error)
    // Return default settings on error
    return {
      id: 'settings',
      siteName: 'İş Otomasyon',
      primaryColor: '#F97316',
    }
  }
}

/**
 * Clear settings cache (call after updating settings)
 */
export function clearSettingsCache() {
  cachedSettings = null
  cacheTimestamp = 0
}

