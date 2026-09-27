import { describe, expect, it } from 'vitest'
import { parseNotification } from './parseNotification'

const base = {
  typeWebhook: 'incomingMessageReceived',
  idMessage: 'abc',
  timestamp: 1700000000,
  senderData: { chatId: '10000000', senderPhoneNumber: 79001234567 },
}

describe('parseNotification', () => {
  it('parses text message', () => {
    const body = { ...base, messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'hi' } } }
    expect(parseNotification(body)).toEqual({
      id: 'abc',
      chatId: '10000000',
      text: 'hi',
      timestamp: 1700000000000,
      outgoing: false,
      senderPhone: '79001234567',
    })
  })

  it('parses extended text message', () => {
    const body = {
      ...base,
      messageData: { typeMessage: 'extendedTextMessage', extendedTextMessageData: { text: 'link' } },
    }
    expect(parseNotification(body)?.text).toBe('link')
  })

  it('ignores non-text messages', () => {
    expect(parseNotification({ ...base, messageData: { typeMessage: 'imageMessage' } })).toBeNull()
  })

  it('ignores other webhook types', () => {
    expect(parseNotification({ typeWebhook: 'stateInstanceChanged' })).toBeNull()
    expect(parseNotification(null)).toBeNull()
  })
})
