import { prisma } from './prisma'

/**
 * Check and expire trials that have passed their end date
 * This function can be called on-demand to update trial statuses
 */
export async function expireTrials() {
  try {
    const now = new Date()

    const result = await prisma.trial.updateMany({
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

    return {
      success: true,
      expiredCount: result.count,
    }
  } catch (error) {
    console.error('Error expiring trials:', error)
    return {
      success: false,
      expiredCount: 0,
    }
  }
}

/**
 * Get active trials for a user and check if any have expired
 * This is called when displaying trials to ensure status is up-to-date
 */
export async function getTrialsWithExpirationCheck(userId: string) {
  // First, expire any trials that should be expired
  await expireTrials()

  // Then return the trials
  return await prisma.trial.findMany({
    where: { userId },
    include: { 
      product: {
        include: { category: true },
      },
      plan: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

