/**
 * PayTR Integration Helper Functions
 *
 * PayTR API Entegrasyonu
 * Merchant ID: 629169
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
 * PayTR ödeme başlatma
 * https://www.paytr.com/dokuman/odeme-formu
 */
export async function initiatePayTRPayment(
  params: PayTRInitiateParams
): Promise<PayTRResponse> {
  const merchantId = process.env.PAYTR_MERCHANT_ID
  const merchantKey = process.env.PAYTR_MERCHANT_KEY
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT
  const apiUrl =
    process.env.PAYTR_API_URL ||
    'https://www.paytr.com/odeme/api/get-token'

  // 1) Ortam değişkenlerini kontrol et
  if (!merchantId || !merchantKey || !merchantSalt) {
    console.error('PayTR config error:', {
      merchantId,
      hasKey: !!merchantKey,
      hasSalt: !!merchantSalt,
    })
    return {
      status: 'error',
      error:
        'PAYTR yapılandırması eksik. Lütfen ortam değişkenlerini kontrol edin.',
    }
  }

  // 2) Tutar kontrolü
  if (params.amount == null || Number.isNaN(params.amount)) {
    console.error('PayTR amount error. Incoming params:', params)
    return {
      status: 'error',
      error: 'Ödeme tutarı bulunamadı.',
    }
  }

  // PayTR amount kuruş cinsinden
  const paymentAmount = Math.round(params.amount * 100)

  // Sepet – Base64 JSON
  const basketItems = [
    [`${params.productId} - ${params.planId}`, paymentAmount, 1],
  ]
  const userBasket = Buffer.from(
    JSON.stringify(basketItems)
  ).toString('base64')

  const noInstallment = '0' // 0 = tüm taksitler serbest
  const maxInstallment = '0'
  const currency = params.currency === 'TRY' ? 'TL' : params.currency
  const testMode =
    process.env.NODE_ENV === 'development' ? '1' : '0'

  // --- ÖNEMLİ: PayTR hash formatı ---
  // hash_str = merchant_id + user_ip + merchant_oid + email +
  //             payment_amount + user_basket +
  //             no_installment + max_installment + currency +
  //             test_mode + merchant_salt
  const hashStr =
    merchantId +
    params.userIp +
    params.merchantOid +
    params.email +
    paymentAmount +
    userBasket +
    noInstallment +
    maxInstallment +
    currency +
    testMode +
    merchantSalt

  // paytr_token = base64_encode( hmac_sha256(hash_str, merchant_key) )
  const paytrToken = crypto
    .createHmac('sha256', merchantKey)
    .update(hashStr)
    .digest('base64')

  const baseUrl =
    process.env.NEXTAUTH_URL || 'http://localhost:3000'

  // PayTR’e giden body
  const requestBody: Record<string, string> = {
    merchant_id: merchantId,
    user_ip: params.userIp,
    merchant_oid: params.merchantOid,
    email: params.email,
    payment_amount: paymentAmount.toString(),
    paytr_token: paytrToken,
    user_basket: userBasket,
    no_installment: noInstallment,
    max_installment: maxInstallment,
    currency,
    test_mode: testMode,
    user_name: params.name,
    user_address: 'Adres bilgisi girilmedi', // zorunlu alan, sabit geçiyoruz
    user_phone: params.phone || '0000000000',
    merchant_ok_url: `${baseUrl}/dashboard/billing/pay/success`,
    merchant_fail_url: `${baseUrl}/dashboard/billing/pay/fail`,
    timeout_limit: '30',
    debug_on: process.env.NODE_ENV === 'development' ? '1' : '0',
    lang: 'tr',
  }

  try {
    console.log('PayTR Request:', {
      merchant_id: merchantId,
      merchant_oid: params.merchantOid,
      payment_amount: paymentAmount,
    })

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (compatible; E2XPayTRClient/1.0; +https://e2x.com.tr)',
        Referer: baseUrl,
      },
      body: new URLSearchParams(requestBody),
    })

    const responseText = await response.text()
    console.log('PayTR Response:', responseText)

    let data: any
    try {
      data = JSON.parse(responseText)
    } catch {
      // JSON değilse direkt hata mesajını dön
      return {
        status: 'error',
        error:
          responseText || 'PayTR API hatası',
      }
    }

    if (data.status === 'success' && data.token) {
      return {
        status: 'success',
        token: data.token,
        iframeUrl: `https://www.paytr.com/odeme/guvenli/${data.token}`,
      }
    } else {
      const errorMessage =
        data.reason ||
        data.err_msg ||
        data.message ||
        data.error ||
        responseText ||
        'Ödeme başlatılamadı'
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
      error:
        error instanceof Error
          ? error.message
          : 'Payment initialization failed',
    }
  }
}

/**
 * PayTR callback imza doğrulama
 * (şu an kritik değil, sadece bildirim için)
 */
export function validatePayTRCallback(
  data: Record<string, string>
): boolean {
  const merchantKey = process.env.PAYTR_MERCHANT_KEY
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT

  if (!merchantKey || !merchantSalt) return false
  const receivedHash = data.hash
  if (!receivedHash) return false

  // hash_str = merchant_oid + merchant_salt + status + total_amount
  const hashStr =
    data.merchant_oid +
    merchantSalt +
    data.status +
    data.total_amount

  const calculatedHash = crypto
    .createHmac('sha256', merchantKey)
    .update(hashStr)
    .digest('base64')

  return receivedHash === calculatedHash
}