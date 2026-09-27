import { describe, expect, it } from 'vitest'
import { phoneToChatId } from './phone'

describe('phoneToChatId', () => {
  it('strips formatting', () => {
    expect(phoneToChatId('+7 (900) 123-45-67')).toBe('79001234567@c.us')
  })

  it('rejects too short and too long numbers', () => {
    expect(phoneToChatId('12345')).toBeNull()
    expect(phoneToChatId('1234567890123456')).toBeNull()
  })
})
