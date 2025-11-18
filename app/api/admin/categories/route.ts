import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Yetkiniz yok' },
        { status: 403 }
      )
    }

    const formData = await request.formData()

    const name = String(formData.get('name') || '').trim()
    const icon = String(formData.get('icon') || '').trim()
    const color = String(formData.get('color') || '').trim()
    const description = String(formData.get('description') || '').trim()
    const isActive = formData.get('isActive') === 'on'

    if (!name || !icon) {
      return NextResponse.json(
        { error: 'Kategori adı ve ikon zorunludur' },
        { status: 400 }
      )
    }

    // Check if category name already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Bu kategori adı zaten kullanılıyor' },
        { status: 400 }
      )
    }

    await prisma.category.create({
      data: {
        name,
        icon,
        color: color || undefined,
        description: description || undefined,
        isActive,
      },
    })

    return NextResponse.json({ success: true, message: 'Kategori başarıyla eklendi' })
  } catch (error) {
    console.error('Category creation error:', error)
    return NextResponse.json(
      { error: 'Kategori eklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Yetkiniz yok' },
        { status: 403 }
      )
    }

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Categories fetch error:', error)
    return NextResponse.json(
      { error: 'Kategoriler yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

