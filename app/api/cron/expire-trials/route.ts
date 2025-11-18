import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Cron Job: Expire Trials
 * 
 * Bu endpoint Vercel Cron Jobs veya manuel olarak çağrılabilir
 * Süresi dolmuş denemeleri otomatik olarak EXPIRED durumuna geçirir
 * 
 * Vercel Cron Jobs için vercel.json'a ekleyin:
 * {
 *   "crons": [{
 *     "path": "/api/cron/expire-trials",
 *     "schedule": "0 0 * * *"
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Security: Check for cron secret or authorization header
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const now = new Date()

    // Find all active trials that have passed their end date
    const expiredTrials = await prisma.trial.updateMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          lte: now,
        },
      },
      data: {
        status: 'EXPIRED',
      },
    })

    return NextResponse.json({
      success: true,
      message: `${expiredTrials.count} deneme otomatik olarak süresi doldu olarak işaretlendi`,
      expiredCount: expiredTrials.count,
      timestamp: now.toISOString(),
    })
  } catch (error) {
    console.error('Trial expiration cron job error:', error)
    return NextResponse.json(
      { error: 'Deneme bitirme işlemi başarısız oldu' },
      { status: 500 }
    )
  }
}

// POST method for manual triggering
export async function POST(request: NextRequest) {
  return GET(request)
}

