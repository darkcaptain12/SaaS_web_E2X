// app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, phone, businessName } = body

    // Basit doğrulama
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Zorunlu alanlar eksik.' },
        { status: 400 }
      )
    }

    // E-posta zaten var mı?
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu e-posta ile zaten bir hesap var.' },
        { status: 400 }
      )
    }

    // Şifreyi hashle
    const passwordHash = await bcrypt.hash(password, 10)

    // Yeni kullanıcı oluştur
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,     // ÖNEMLİ: şema passwordHash bekliyor
        phone: phone || null,
        businessName: businessName || null,
        role: 'USER',     // normal kullanıcı
      },
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Kayıt sırasında bir hata oluştu.' },
      { status: 500 }
    )
  }
}