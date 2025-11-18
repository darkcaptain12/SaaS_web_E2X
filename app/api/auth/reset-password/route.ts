import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, token, password } = await request.json()

    if (!email || !token || !password) {
      return NextResponse.json(
        { error: 'Eksik bilgi' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Şifre en az 6 karakter olmalıdır' },
        { status: 400 }
      )
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Geçersiz şifre sıfırlama linki' },
        { status: 400 }
      )
    }

    // TODO: Token doğrulama
    // Gerçek uygulamada token'ı veritabanında kontrol etmeli
    // Şimdilik basit bir kontrol yapıyoruz
    // Token'ın geçerliliğini kontrol etmek için PasswordResetToken modeli oluşturulmalı

    // Şifreyi hashle ve güncelle
    const passwordHash = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    })

    // TODO: Token'ı geçersiz kıl (kullanıldı olarak işaretle)

    return NextResponse.json({
      message: 'Şifre başarıyla güncellendi',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    )
  }
}

