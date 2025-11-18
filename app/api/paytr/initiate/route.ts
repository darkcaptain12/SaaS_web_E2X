import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { initiatePayTRPayment } from '@/lib/paytr'

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

    if (!productId || !planId) {
      return NextResponse.json(
        { error: 'Ürün ve plan ID gerekli' },
        { status: 400 }
      )
    }

    // Get plan and product
    const plan = await prisma.plan.findUnique({
      where: { id: planId, isActive: true },
      include: { product: true },
    })

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan bulunamadı' },
        { status: 404 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // Get user IP address
    // PayTR requires real IP address, not localhost
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    let userIp = forwarded ? forwarded.split(',')[0].trim() : realIp || ''
    
    // If still localhost or empty, try to get from request
    if (!userIp || userIp === '127.0.0.1' || userIp === '::1' || userIp.startsWith('192.168.') || userIp.startsWith('10.')) {
      // For development, use a placeholder IP (PayTR might reject localhost)
      userIp = process.env.NODE_ENV === 'development' ? '88.249.127.1' : '127.0.0.1'
    }

    // Create payment record with unique merchant OID
    const merchantOid = `PAY-${Date.now()}-${session.user.id.substring(0, 8)}`
    
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        productId,
        planId,
        amount: plan.price,
        currency: plan.currency,
        status: 'PENDING',
        paytrTransactionId: merchantOid,
      },
    })

    // Initiate PayTR payment
    const paytrResponse = await initiatePayTRPayment({
      userId: session.user.id,
      productId,
      planId,
      amount: Number(plan.price),
      currency: plan.currency,
      email: user.email,
      phone: user.phone || '',
      name: user.name,
      userIp,
      merchantOid,
    })

    if (paytrResponse.status === 'error') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      })

      return NextResponse.json(
        { error: paytrResponse.error || 'Ödeme başlatılamadı' },
        { status: 500 }
      )
    }

    // Update payment with PayTR token
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paytrTransactionId: paytrResponse.token || merchantOid,
      },
    })

    return NextResponse.json({
      paymentId: payment.id,
      paymentUrl: paytrResponse.iframeUrl || `https://www.paytr.com/odeme/guvenli/${paytrResponse.token}`,
      token: paytrResponse.token,
    })
  } catch (error) {
    console.error('PayTR initiate error:', error)
    return NextResponse.json(
      { error: 'Ödeme başlatılamadı' },
      { status: 500 }
    )
  }
}

