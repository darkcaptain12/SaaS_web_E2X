import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'E-posta adresi gereklidir' },
        { status: 400 }
      )
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Güvenlik: Kullanıcı yoksa bile başarılı mesajı göster
    // Bu, email enumeration saldırılarını önler
    if (!user) {
      // Gerçek uygulamada email göndermeden başarı mesajı döndür
      return NextResponse.json({
        message: 'Eğer bu e-posta adresi kayıtlıysa, şifre sıfırlama linki gönderildi.',
      })
    }

    // Şifre sıfırlama token'ı oluştur
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date()
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1) // 1 saat geçerli

    // Token'ı veritabanına kaydet (şimdilik user modelinde yok, basit bir yaklaşım)
    // Gerçek uygulamada PasswordResetToken modeli oluşturulmalı
    
    // TODO: Email gönderme servisi entegrasyonu
    // Şimdilik console'a log yazıyoruz
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`
    
    console.log('=== ŞİFRE SIFIRLAMA LİNKİ ===')
    console.log(`Kullanıcı: ${user.name} (${user.email})`)
    console.log(`Reset URL: ${resetUrl}`)
    console.log(`Token: ${resetToken}`)
    console.log('============================')
    
    // Gerçek uygulamada burada email gönderilir:
    // await sendPasswordResetEmail(user.email, resetUrl)

    return NextResponse.json({
      message: 'Eğer bu e-posta adresi kayıtlıysa, şifre sıfırlama linki gönderildi.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    )
  }
}

