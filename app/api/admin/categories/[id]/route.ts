import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Yetkiniz yok' },
        { status: 403 }
      )
    }

    const category = await prisma.category.findUnique({
      where: { id: params.id },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Kategori bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Category fetch error:', error)
    return NextResponse.json(
      { error: 'Kategori yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id },
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Kategori bulunamadı' },
        { status: 404 }
      )
    }

    // Check if name is already taken by another category
    if (name !== existingCategory.name) {
      const nameTaken = await prisma.category.findUnique({
        where: { name },
      })

      if (nameTaken) {
        return NextResponse.json(
          { error: 'Bu kategori adı zaten kullanılıyor' },
          { status: 400 }
        )
      }
    }

    await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        icon,
        color: color || undefined,
        description: description || undefined,
        isActive,
      },
    })

    return NextResponse.json({ success: true, message: 'Kategori başarıyla güncellendi' })
  } catch (error) {
    console.error('Category update error:', error)
    return NextResponse.json(
      { error: 'Kategori güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Yetkiniz yok' },
        { status: 403 }
      )
    }

    const categoryId = params.id

    // Check if category exists and has products
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Kategori bulunamadı' },
        { status: 404 }
      )
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        { error: 'Bu kategoriye ait ürünler var. Önce ürünleri silin veya başka kategoriye taşıyın.' },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id: categoryId },
    })

    return NextResponse.json({ success: true, message: 'Kategori başarıyla silindi' })
  } catch (error) {
    console.error('Category deletion error:', error)
    return NextResponse.json(
      { error: 'Kategori silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

