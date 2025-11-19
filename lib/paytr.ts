/**
 * PayTR Integration Helper Functions
 *
 * PayTR API Entegrasyonu
 * Merchant ID: 629169
 * Merchant Key: q2KcPX7iH4Yhp6gz
 * Merchant Salt: yiUZsqk4ZEGqh32o
 */

import crypto from 'crypto'

interface PayTRInitiateParams {
  userId: string
  productId: string
  planId: string
  amount: number
  currency: string
  email: string
  phone?: string
  name: string
  userIp: string
  merchantOid: string
}

interface PayTRResponse {
  status: string
  token?: string
  error?: string
  iframeUrl?: string
}

/**
 * Creates a payment token/iframe URL from PayTR
 *
 * PayTR API entegrasyonu - Gerçek API çağrısı
 */
export async function initiatePayTRPayment(params: PayTRInitiateParams): Promise<PayTRResponse> {
  const merchantId = process.env.PAYTR_MERCHANT_ID
  const merchantKey = process.env.PAYTR_MERCHANT_KEY
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT
  const apiUrl = process.env.PAYTR_API_URL || 'https://www.paytr.com/odeme/api/get-token'

  // 1) Ortam değişkenlerini kontrol et
  if (!merchantId || !merchantKey || !merchantSalt) {
    console.error('PayTR config error:', {
      merchantId,
      hasKey: !!merchantKey,
      hasSalt: !!merchantSalt,
    })
    return {
      status: 'error',
      error: 'PAYTR yapılandırması eksik. Lütfen ortam değişkenlerini kontrol edin.',
    }
  }

  // 2) Tutarı kontrol et
  if (params.amount == null || Number.isNaN(params.amount)) {
    console.error('PayTR amount error. Incoming params:', params)
    return {
      status: 'error',
      error: 'Ödeme tutarı bulunamadı.',
    }
  }

  // PayTR amount should be in kuruş (multiply by 100 for TRY)
  const paymentAmount = Math.round(params.amount * 100)

  // User basket - Base64 encoded JSON array
  // Format: [["Ürün Adı", fiyat_kurus, adet], ...]
  const basketItems = [[`${params.productId} - ${params.planId}`, paymentAmount, 1]]
  const userBasket = Buffer.from(JSON.stringify(basketItems)).toString('base64')

  // PayTR hash calculation
  // Hash string format: merchant_id + merchant_salt + merchant_oid + user_ip + email + payment_amount + user_basket
  const hashString = `${merchantId}${merchantSalt}${params.merchantOid}${params.userIp}${params.email}${paymentAmount}${userBasket}`
  const hash = crypto.createHash('sha256').update(hashString).digest('base64')

  // Build request body
  // NOT: merchant_key is NOT sent in request body, only used for hash calculation
  const requestBody: Record<string, string> = {
    merchant_id: merchantId,
    merchant_salt: merchantSalt,
    merchant_oid: params.merchantOid,
    email: params.email,
    payment_amount: paymentAmount.toString(),
    paytr_token: hash,
    user_basket: userBasket,
    user_ip: params.userIp,
    user_name: params.name,
    user_phone: params.phone || '',
    merchant_ok_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard/billing/pay/success`,
    merchant_fail_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard/billing/pay/fail`,
    timeout_limit: '30',
    currency: params.currency === 'TRY' ? 'TL' : params.currency,
    test_mode: process.env.NODE_ENV === 'development' ? '1' : '0',
    no_installment: '0',
    max_installment: '0',
    lang: 'tr',
  }

  try {
    // Log request for debugging (remove in production)
    console.log('PayTR Request:', {
      merchant_id: merchantId,
      merchant_oid: params.merchantOid,
      payment_amount: paymentAmount,
      hash_length: hash.length,
    })

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(requestBody),
    })

    // PayTR returns text/plain, not JSON
    const responseText = await response.text()
    console.log('PayTR Response:', responseText)

    // Try to parse as JSON, if fails, treat as error
    let data: any
    try {
      data = JSON.parse(responseText)
    } catch {
      // If not JSON, it's likely an error message
      return {
        status: 'error',
        error: responseText || 'PayTR API hatası',
      }
    }

    if (data.status === 'success' && data.token) {
      return {
        status: 'success',
        token: data.token,
        iframeUrl: `https://www.paytr.com/odeme/guvenli/${data.token}`,
      }
    } else {
      // PayTR error response
      const errorMessage = data.reason || data.error || responseText || 'Ödeme başlatılamadı'
      console.error('PayTR API Error:', errorMessage, data)
      return {
        status: 'error',
        error: errorMessage,
      }
    }
  } catch (error) {
    console.error('PayTR API error:', error)
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Payment initialization failed',
    }
  }
}

/**
 * Validates PayTR callback signature
 *
 * PayTR callback hash doğrulama
 * Hash: merchant_salt + merchant_oid + status + total_amount
 */
export function validatePayTRCallback(data: Record<string, string>): boolean {
  const merchantKey = process.env.PAYTR_MERCHANT_KEY || 'q2KcPX7iH4Yhp6gz'
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT || 'yiUZsqk4ZEGqh32o'

  if (!merchantKey || !merchantSalt) {
    return false
  }

  const receivedHash = data.hash
  if (!receivedHash) {
    return false
  }

  // Calculate expected hash
  // PayTR callback hash: merchant_salt + merchant_oid + status + total_amount
  const hashString = `${merchantSalt}${data.merchant_oid}${data.status}${data.total_amount}`
  const calculatedHash = crypto.createHash('sha256').update(hashString).digest('base64')

  return receivedHash === calculatedHash
}

/**
 * Helper to calculate PayTR hash for payment initiation
 */
export function calculatePayTRHash(
  merchantId: string,
  merchantSalt: string,
  merchantOid: string,
  userIp: string,
  email: string,
  paymentAmount: number,
  userBasket: string
): string {
  const hashString = `${merchantId}${merchantSalt}${merchantOid}${userIp}${email}${paymentAmount}${userBasket}`
  return crypto.createHash('sha256').update(hashString).digest('base64')
}