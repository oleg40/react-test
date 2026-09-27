import { FormEvent, useState } from 'react'
import { phoneToChatId } from '../lib/phone'

interface Props {
  onCreate: (chatId: string) => void
  onLogout: () => void
}

export function NewChatForm({ onCreate, onLogout }: Props) {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const chatId = phoneToChatId(phone)
    if (!chatId) {
      setError('Enter a phone number in international format, e.g. 79001234567')
      return
    }
    onCreate(chatId)
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h1>New chat</h1>
      <input
        placeholder="Recipient phone, e.g. 79001234567"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value)
          setError('')
        }}
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Create chat</button>
      <button type="button" className="link" onClick={onLogout}>
        Log out
      </button>
    </form>
  )
}
