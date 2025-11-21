/**
 * Simple math-based CAPTCHA
 * Avoids third-party dependencies while providing bot protection
 */

export function generateCaptcha(): { question: string; answer: number; token: string } {
  const num1 = Math.floor(Math.random() * 10) + 1
  const num2 = Math.floor(Math.random() * 10) + 1
  const operations = ['+', '-'] as const
  const operation = operations[Math.floor(Math.random() * operations.length)]
  
  let answer: number
  let question: string
  
  if (operation === '+') {
    answer = num1 + num2
    question = `What is ${num1} + ${num2}?`
  } else {
    // Ensure subtraction doesn't go negative
    const larger = Math.max(num1, num2)
    const smaller = Math.min(num1, num2)
    answer = larger - smaller
    question = `What is ${larger} - ${smaller}?`
  }
  
  // Create a simple token (in production, consider JWT or encryption)
  const token = Buffer.from(`${answer}:${Date.now()}`).toString('base64')
  
  return { question, answer, token }
}

export function verifyCaptcha(token: string, userAnswer: number): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [correctAnswer, timestamp] = decoded.split(':')
    
    // Token expires after 5 minutes
    const tokenAge = Date.now() - parseInt(timestamp)
    if (tokenAge > 5 * 60 * 1000) {
      return false
    }
    
    return parseInt(correctAnswer) === userAnswer
  } catch {
    return false
  }
}
