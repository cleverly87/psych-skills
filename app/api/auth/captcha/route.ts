import { NextResponse } from 'next/server'
import { generateCaptcha } from '@/lib/captcha'

export async function GET() {
  const captcha = generateCaptcha()
  
  console.log('CAPTCHA Generated:', { question: captcha.question, answer: captcha.answer })
  
  return NextResponse.json({
    question: captcha.question,
    token: captcha.token,
  })
}

export const dynamic = 'force-dynamic'
