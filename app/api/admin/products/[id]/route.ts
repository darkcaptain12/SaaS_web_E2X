import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BillingPeriod } from '@prisma/client'

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

    const productId = params.id

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        plans: {
          orderBy: { price: 'asc' },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { error: 'Ürün yüklenirken bir hata oluştu' },
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

    const productId = params.id
    const formData = await request.formData()

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı' },
        { status: 404 }
      )
    }

    // Product fields
    const name = String(formData.get('name') || '').trim()
    const description = String(formData.get('description') || '').trim()
    const shortDescription = String(formData.get('shortDescription') || description || '').trim()
    const categoryId = String(formData.get('categoryId') || '').trim()
    const trialDaysRaw = String(formData.get('trialDays') || '').trim()
    const isActive = formData.get('isActive') === 'on'
    const demoUrl = String(formData.get('demoUrl') || '').trim()
    const demoUsername = String(formData.get('demoUsername') || '').trim()
    const demoPassword = String(formData.get('demoPassword') || '').trim()

    // Validation
    if (!name || !description || !shortDescription || !categoryId) {
      return NextResponse.json(
        { error: 'Lütfen tüm zorunlu alanları doldurun' },
        { status: 400 }
      )
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Seçilen kategori bulunamadı' },
        { status: 404 }
      )
    }

    const trialDays = Number.isNaN(Number(trialDaysRaw)) ? 7 : Number(trialDaysRaw)

    // Generate slug from name if name changed
    let slug = existingProduct.slug
    if (name !== existingProduct.name) {
      slug = name
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 100) + '-' + Date.now()
    }

    // Parse plans from form data
    const planIds = formData.getAll('planId')
    const planNames = formData.getAll('planName')
    const planBillingPeriods = formData.getAll('planBillingPeriod')
    const planPrices = formData.getAll('planPrice')
    const planCurrencies = formData.getAll('planCurrency')
    const planDescriptions = formData.getAll('planDescription')
    const planDemoUrls = formData.getAll('planDemoUrl')
    const planIsActive = formData.getAll('planIsActive')

    // Update product
    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        slug,
        description,
        shortDescription,
        categoryId,
        trialDays,
        isActive,
        demoUrl: demoUrl || undefined,
        demoUsername: demoUsername || undefined,
        demoPassword: demoPassword || undefined,
      },
    })

    // Handle plans - update existing or create new
    const plansToUpdate: Array<{ id: string; data: any }> = []
    const plansToCreate: Array<any> = []

    for (let i = 0; i < planNames.length; i++) {
      const planId = planIds[i] ? String(planIds[i]) : null
      const planName = String(planNames[i] || '').trim()
      const planPrice = String(planPrices[i] || '').trim()

      if (planName && planPrice && !Number.isNaN(Number(planPrice))) {
        const planData = {
          name: planName,
          billingPeriod: (planBillingPeriods[i] as BillingPeriod) || 'MONTHLY',
          price: Number(planPrice),
          currency: String(planCurrencies[i] || 'TRY'),
          description: String(planDescriptions[i] || '').trim() || undefined,
          demoUrl: String(planDemoUrls[i] || '').trim() || undefined,
          isActive: planIsActive[i] === 'on',
        }

        if (planId) {
          // Update existing plan
          plansToUpdate.push({ id: planId, data: planData })
        } else {
          // Create new plan
          plansToCreate.push(planData)
        }
      }
    }

    // Update existing plans
    for (const { id, data } of plansToUpdate) {
      await prisma.plan.update({
        where: { id },
        data,
      })
    }

    // Create new plans
    if (plansToCreate.length > 0) {
      await prisma.plan.createMany({
        data: plansToCreate.map((plan) => ({
          ...plan,
          productId,
        })),
      })
    }

    // Delete plans that are not in the form (optional - you might want to keep them)
    // For now, we'll keep all existing plans and only update/create the ones in the form

    return NextResponse.json({ success: true, message: 'Ürün başarıyla güncellendi' })
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { error: 'Ürün güncellenirken bir hata oluştu' },
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

    const productId = params.id

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        _count: {
          select: {
            trials: true,
            subscriptions: true,
            payments: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı' },
        { status: 404 }
      )
    }

    // Check if product has active subscriptions or trials
    if (product._count.subscriptions > 0 || product._count.trials > 0) {
      return NextResponse.json(
        { error: 'Bu ürünü silemezsiniz. Aktif abonelikler veya denemeler var. Önce bunları iptal edin veya silin.' },
        { status: 400 }
      )
    }

    // Delete product (cascade will delete plans)
    await prisma.product.delete({
      where: { id: productId },
    })

    return NextResponse.json({ success: true, message: 'Ürün başarıyla silindi' })
  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json(
      { error: 'Ürün silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

