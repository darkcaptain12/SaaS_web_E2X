import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { PlanTier } from '@prisma/client'

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

    // trialDays sayı değilse 7 gün kabul edelim
    const trialDays = Number.isNaN(Number(trialDaysRaw)) ? 7 : Number(trialDaysRaw)

    // Generate slug from name
    const slug = name
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

    // Parse plans from form data
    const plans: Array<{
      name: string
      billingPeriod: 'MONTHLY' | 'YEARLY' | 'LIFETIME'
      price: number
      currency: string
      description?: string
      isActive: boolean
      tier: PlanTier
    }> = []

    // Get all plan entries
    const planNames = formData.getAll('planName')
    const planBillingPeriods = formData.getAll('planBillingPeriod')
    const planPrices = formData.getAll('planPrice')
    const planCurrencies = formData.getAll('planCurrency')
    const planDescriptions = formData.getAll('planDescription')
    const planIsActive = formData.getAll('planIsActive')

    for (let i = 0; i < planNames.length; i++) {
      const planName = String(planNames[i] || '').trim()
      const planPrice = String(planPrices[i] || '').trim()
      
      if (planName && planPrice && !Number.isNaN(Number(planPrice))) {
        plans.push({
          name: planName,
          tier: (i === 0
            ? 'BASIC'
            : i === 1
            ? 'PROFESSIONAL'
            : 'PREMIUM') as PlanTier,
          billingPeriod: (planBillingPeriods[i] as 'MONTHLY' | 'YEARLY' | 'LIFETIME') || 'MONTHLY',
          price: Number(planPrice),
          currency: String(planCurrencies[i] || 'TRY'),
          description: String(planDescriptions[i] || '').trim() || undefined,
          isActive: planIsActive[i] === 'on',
        })
      }
    }

    // Create product with plans
    await prisma.product.create({
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
        plans: {
          create: plans.length > 0 ? plans : [
            {
              name: 'Temel',
              tier: 'BASIC' as PlanTier,
              billingPeriod: 'MONTHLY',
              price: 299.00,
              currency: 'TRY',
              description: 'Küçük işletmeler için ideal',
              isActive: true,
            },
          ],
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Ürün eklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
