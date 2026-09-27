import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { Credentials, sendMessage } from '../api/greenApi'
import { useNotifications } from '../hooks/useNotifications'
import { Message } from '../lib/parseNotification'

interface Props {
  creds: Credentials
  chatId: string
  messages: Message[]
  onMessage: (message: Message) => void
  onNewChat: () => void
  onLogout: () => void
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function Chat({ creds, chatId, messages, onMessage, onNewChat, onLogout }: Props) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  useNotifications(creds, chatId, onMessage)

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight)
  }, [messages])

  async function send() {
    const message = text.trim()
    if (!message || sending) {
      return
    }
    setSending(true)
    try {
      const { idMessage } = await sendMessage(creds, chatId, message)
      onMessage({ id: idMessage, chatId, text: message, timestamp: Date.now(), outgoing: true })
      setText('')
    } catch {
      alert('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    send()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send()
    }
  }

  return (
    <div className="chat">
      <header className="chat-header">
        <span className="chat-title">+{chatId.replace('@c.us', '')}</span>
        <button className="link" onClick={onNewChat}>
          New chat
        </button>
        <button className="link" onClick={onLogout}>
          Log out
        </button>
      </header>
      <div className="messages" ref={listRef}>
        {messages.map((message) => (
          <div key={message.id} className={`bubble ${message.outgoing ? 'outgoing' : 'incoming'}`}>
            <span className="text">{message.text}</span>
            <span className="time">{formatTime(message.timestamp)}</span>
          </div>
        ))}
      </div>
      <form className="composer" onSubmit={handleSubmit}>
        <textarea
          rows={1}
          placeholder="Message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" disabled={sending || !text.trim()}>
          Send
        </button>
      </form>
    </div>
  )
}
