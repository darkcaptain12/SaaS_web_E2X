import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/settings'

export async function GET() {
  try {
    const settings = await getSettings()
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Settings fetch error:', error)
    return NextResponse.json(
      { error: 'Ayarlar yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

