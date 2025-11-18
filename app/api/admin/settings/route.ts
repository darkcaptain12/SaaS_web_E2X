import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Yetkiniz yok' },
        { status: 403 }
      )
    }

    let settings = await prisma.settings.findUnique({
      where: { id: 'settings' },
    })

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: 'settings',
        },
      })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Settings fetch error:', error)
    return NextResponse.json(
      { error: 'Ayarlar yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Yetkiniz yok' },
        { status: 403 }
      )
    }

    const formData = await request.formData()

    const data: any = {
      siteName: String(formData.get('siteName') || 'İş Otomasyon').trim(),
      siteDescription: String(formData.get('siteDescription') || '').trim() || undefined,
      logoText: String(formData.get('logoText') || '').trim() || undefined,
      logoUrl: String(formData.get('logoUrl') || '').trim() || undefined,
      primaryColor: String(formData.get('primaryColor') || '#F97316').trim(),
      secondaryColor: String(formData.get('secondaryColor') || '').trim() || undefined,
      whatsappPhone: String(formData.get('whatsappPhone') || '').trim() || undefined,
      whatsappMessage: String(formData.get('whatsappMessage') || '').trim() || undefined,
      footerDescription: String(formData.get('footerDescription') || '').trim() || undefined,
      footerCopyright: String(formData.get('footerCopyright') || '').trim() || undefined,
      contactEmail: String(formData.get('contactEmail') || '').trim() || undefined,
      contactPhone: String(formData.get('contactPhone') || '').trim() || undefined,
      contactAddress: String(formData.get('contactAddress') || '').trim() || undefined,
      socialFacebook: String(formData.get('socialFacebook') || '').trim() || undefined,
      socialInstagram: String(formData.get('socialInstagram') || '').trim() || undefined,
      socialTwitter: String(formData.get('socialTwitter') || '').trim() || undefined,
      socialLinkedIn: String(formData.get('socialLinkedIn') || '').trim() || undefined,
      metaTitle: String(formData.get('metaTitle') || '').trim() || undefined,
      metaDescription: String(formData.get('metaDescription') || '').trim() || undefined,
      metaKeywords: String(formData.get('metaKeywords') || '').trim() || undefined,
      faviconUrl: String(formData.get('faviconUrl') || '').trim() || undefined,
      ogImageUrl: String(formData.get('ogImageUrl') || '').trim() || undefined,
    }

    const settings = await prisma.settings.upsert({
      where: { id: 'settings' },
      update: data,
      create: {
        id: 'settings',
        ...data,
      },
    })

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json(
      { error: 'Ayarlar güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

