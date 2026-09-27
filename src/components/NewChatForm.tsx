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
      setError('Введите номер в международном формате, например 79001234567')
      return
    }
    onCreate(chatId)
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h1>Новый чат</h1>
      <input
        placeholder="Номер получателя, например 79001234567"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value)
          setError('')
        }}
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Создать чат</button>
      <button type="button" className="link" onClick={onLogout}>
        Выйти
      </button>
    </form>
  )
}
