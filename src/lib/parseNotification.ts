export interface Message {
  id: string
  chatId: string
  text: string
  timestamp: number
  outgoing: boolean
}

export interface IncomingMessage extends Message {
  senderPhone: string
}

interface IncomingBody {
  typeWebhook?: string
  idMessage?: string
  timestamp?: number
  senderData?: { chatId?: string; senderPhoneNumber?: number | string }
  messageData?: {
    typeMessage?: string
    textMessageData?: { textMessage?: string }
    extendedTextMessageData?: { text?: string }
  }
}

export function parseNotification(body: unknown): IncomingMessage | null {
  const data = body as IncomingBody | null
  if (!data || data.typeWebhook !== 'incomingMessageReceived') {
    return null
  }
  const { messageData, senderData } = data
  let text: string | undefined
  if (messageData?.typeMessage === 'textMessage') {
    text = messageData.textMessageData?.textMessage
  } else if (messageData?.typeMessage === 'extendedTextMessage') {
    text = messageData.extendedTextMessageData?.text
  }
  if (text === undefined || !senderData?.chatId || !data.idMessage) {
    return null
  }
  return {
    id: data.idMessage,
    chatId: senderData.chatId,
    text,
    timestamp: (data.timestamp ?? Date.now() / 1000) * 1000,
    outgoing: false,
    senderPhone: String(senderData.senderPhoneNumber ?? '').replace(/\D/g, ''),
  }
}
