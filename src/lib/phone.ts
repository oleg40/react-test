export function phoneToChatId(phone: string): string | null {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 15) {
    return null
  }
  return `${digits}@c.us`
}
