import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validatePayTRCallback } from '@/lib/paytr'

/**
 * PayTR Callback Handler
 * 
 * This endpoint receives POST requests from PayTR after payment processing
 * TODO: Configure PayTR to send callbacks to this URL
 */
export async function POST(request: NextRequest) {
  try {
    // Get callback data
    const formData = await request.formData()
    const callbackData: Record<string, string> = {}
    
    formData.forEach((value, key) => {
      callbackData[key] = value.toString()
    })

    // Validate PayTR signature
    const isValid = validatePayTRCallback(callbackData)
    if (!isValid) {
      console.error('Invalid PayTR callback signature')
      return NextResponse.json({ status: 'error', message: 'Invalid signature' }, { status: 400 })
    }

    // Extract payment info from callback
    const merchantOid = callbackData.merchant_oid || ''
    const status = callbackData.status || ''
    const totalAmount = callbackData.total_amount || '0'
    const hash = callbackData.hash || ''

    if (!merchantOid) {
      return NextResponse.json({ status: 'error', message: 'Missing merchant_oid' }, { status: 400 })
    }

    // Find payment by PayTR transaction ID
    const payment = await prisma.payment.findFirst({
      where: {
        paytrTransactionId: merchantOid,
      },
      include: {
        user: true,
        product: true,
        plan: true,
      },
    })

    if (!payment) {
      console.error('Payment not found for transaction:', merchantOid)
      return NextResponse.json({ status: 'error', message: 'Payment not found' }, { status: 404 })
    }

    // Update payment status
    if (status === 'success') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'SUCCESS',
          paytrRawData: JSON.stringify(callbackData),
        },
      })

      // Create or update subscription
      const now = new Date()
      let nextBillingDate: Date | null = null

      if (payment.plan.billingPeriod === 'MONTHLY') {
        nextBillingDate = new Date(now)
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
      } else if (payment.plan.billingPeriod === 'YEARLY') {
        nextBillingDate = new Date(now)
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1)
      }

      let endDate: Date | null = null
      if (payment.plan.billingPeriod !== 'LIFETIME') {
        endDate = nextBillingDate
      }

      // Check if subscription already exists
      const existingSubscription = await prisma.subscription.findFirst({
        where: {
          userId: payment.userId,
          productId: payment.productId,
          status: 'ACTIVE',
        },
      })

      if (existingSubscription) {
        // Update existing subscription
        await prisma.subscription.update({
          where: { id: existingSubscription.id },
          data: {
            planId: payment.planId,
            nextBillingDate,
            endDate,
            status: 'ACTIVE',
          },
        })
      } else {
        // Create new subscription
        await prisma.subscription.create({
          data: {
            userId: payment.userId,
            productId: payment.productId,
            planId: payment.planId,
            status: 'ACTIVE',
            startDate: now,
            nextBillingDate,
            endDate,
          },
        })
      }

      // Mark related trial as CONVERTED if exists
      await prisma.trial.updateMany({
        where: {
          userId: payment.userId,
          productId: payment.productId,
          status: 'ACTIVE',
        },
        data: {
          status: 'CONVERTED',
        },
      })
    } else {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          paytrRawData: JSON.stringify(callbackData),
        },
      })
    }

    // Return success response to PayTR
    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('PayTR callback error:', error)
    return NextResponse.json(
      { status: 'error', message: 'Callback processing failed' },
      { status: 500 }
    )
  }
}

