import { useEffect, useRef } from 'react'
import { Credentials, deleteNotification, receiveNotification } from '../api/greenApi'
import { Message, parseNotification } from '../lib/parseNotification'

const RETRY_DELAY_MS = 3000

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useNotifications(creds: Credentials, chatId: string, onMessage: (message: Message) => void) {
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    async function poll() {
      while (!signal.aborted) {
        try {
          const notification = await receiveNotification(creds, signal)
          if (!notification) {
            continue
          }
          const message = parseNotification(notification.body)
          const phone = chatId.replace('@c.us', '')
          if (message && (message.chatId === chatId || message.senderPhone === phone)) {
            onMessageRef.current({
              id: message.id,
              chatId,
              text: message.text,
              timestamp: message.timestamp,
              outgoing: false,
            })
          }
          await deleteNotification(creds, notification.receiptId, signal)
        } catch {
          if (!signal.aborted) {
            await sleep(RETRY_DELAY_MS)
          }
        }
      }
    }

    poll()
    return () => controller.abort()
  }, [creds, chatId])
}
