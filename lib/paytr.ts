/**
 * PayTR Integration Helper Functions
 *
 * Geliştirilmiş PayTR API entegrasyonu
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

export async function initiatePayTRPayment(params: PayTRInitiateParams): Promise<PayTRResponse> {
  const merchantId = process.env.PAYTR_MERCHANT_ID || ''
  const merchantKey = process.env.PAYTR_MERCHANT_KEY || ''
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT || ''
  const apiUrl = 'https://www.paytr.com/odeme/api/get-token'

  if (!merchantId || !merchantKey || !merchantSalt) {
    console.error("Missing PayTR configuration:", {
      merchantId,
      hasKey: !!merchantKey,
      hasSalt: !!merchantSalt,
    })
    return { status: "error", error: "PAYTR yapılandırması eksik." }
  }

  if (!params.amount || Number.isNaN(params.amount)) {
    console.error("Amount error:", params)
    return { status: "error", error: "Ödeme tutarı geçersiz." }
  }

  const paymentAmount = Math.round(params.amount * 100)

  const basket = [[`${params.productId}-${params.planId}`, paymentAmount, 1]]
  const userBasket = Buffer.from(JSON.stringify(basket)).toString("base64")

  const hashStr =
    merchantId +
    merchantSalt +
    params.merchantOid +
    params.userIp +
    params.email +
    paymentAmount +
    userBasket

  const paytrToken = crypto.createHmac("sha256", merchantKey)
    .update(hashStr)
    .digest("base64")

  const body = {
    merchant_id: merchantId,
    merchant_salt: merchantSalt,
    merchant_oid: params.merchantOid,
    email: params.email,
    payment_amount: paymentAmount.toString(),
    paytr_token: paytrToken,
    user_basket: userBasket,
    user_ip: params.userIp || "127.0.0.1",
    user_name: params.name,
    user_phone: params.phone || "",
    merchant_ok_url: `${process.env.NEXTAUTH_URL}/dashboard/billing/pay/success`,
    merchant_fail_url: `${process.env.NEXTAUTH_URL}/dashboard/billing/pay/fail`,
    timeout_limit: "30",
    currency: "TL",
    test_mode: process.env.NODE_ENV === "development" ? "1" : "0",
    no_installment: "0",
    max_installment: "0",
    lang: "tr",
  }

  console.log("PayTR Request:", {
    merchant_id: merchantId,
    merchant_oid: params.merchantOid,
    payment_amount: paymentAmount,
    hash_length: paytrToken.length,
  })

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(body),
    })

    const raw = await res.text()
    console.log("PayTR Raw Response:", raw)
    console.log("HTTP Status:", res.status)

    let json
    try {
      json = JSON.parse(raw)
    } catch {
      return { status: "error", error: raw }
    }

    if (json.status === "success" && json.token) {
      return {
        status: "success",
        token: json.token,
        iframeUrl: `https://www.paytr.com/odeme/guvenli/${json.token}`
      }
    }

    return {
      status: "error",
      error: json.reason || raw
    }

  } catch (err: any) {
    console.error("PayTR API error:", err)
    return { status: "error", error: err?.message || "API hatası" }
  }
}

export function validatePayTRCallback(data: Record<string,string>): boolean {
  const merchantKey = process.env.PAYTR_MERCHANT_KEY || ""
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT || ""

  if (!merchantKey || !merchantSalt) return false
  const received = data.hash
  if (!received) return false

  const str = merchantSalt + data.merchant_oid + data.status + data.total_amount
  const calc = crypto.createHmac("sha256", merchantKey)
    .update(str)
    .digest("base64")

  return received === calc
}