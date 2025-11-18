import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId, planId } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Ürün ID gerekli' },
        { status: 400 }
      )
    }

    // Get product
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı' },
        { status: 404 }
      )
    }

    // Check if user already has an active trial for this product
    const existingTrial = await prisma.trial.findFirst({
      where: {
        userId: session.user.id,
        productId,
        status: 'ACTIVE',
      },
    })

    if (existingTrial) {
      return NextResponse.json(
        { error: 'Bu ürün için zaten aktif bir denemeniz var' },
        { status: 400 }
      )
    }

    // Calculate end date
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + product.trialDays)

    // Create trial
    const trial = await prisma.trial.create({
      data: {
        userId: session.user.id,
        productId,
        planId: planId || null,
        startDate,
        endDate,
        status: 'ACTIVE',
      },
      include: {
        product: true,
      },
    })

    return NextResponse.json(
      { message: 'Deneme başlatıldı', trial },
      { status: 201 }
    )
  } catch (error) {
    console.error('Trial start error:', error)
    return NextResponse.json(
      { error: 'Deneme başlatılamadı' },
      { status: 500 }
    )
  }
}

