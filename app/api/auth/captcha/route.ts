import { NextResponse } from 'next/server'
import { generateCaptcha } from '@/lib/captcha'

export async function GET() {
  const captcha = generateCaptcha()
  
  return NextResponse.json({
    question: captcha.question,
    token: captcha.token,
  })
}
