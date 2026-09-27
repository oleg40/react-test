import { FormEvent, useState } from 'react'
import { Credentials, DEFAULT_API_URL, getStateInstance } from '../api/greenApi'

interface Props {
  onLogin: (creds: Credentials) => void
}

export function LoginForm({ onLogin }: Props) {
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL)
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const creds = { apiUrl: apiUrl.trim(), idInstance: idInstance.trim(), apiTokenInstance: apiTokenInstance.trim() }
    setLoading(true)
    setError('')
    try {
      const { stateInstance } = await getStateInstance(creds)
      if (stateInstance === 'authorized') {
        onLogin(creds)
      } else {
        setError(`Инстанс не готов: ${stateInstance}`)
      }
    } catch {
      setError('Неверные учетные данные или apiUrl')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h1>Вход в GREEN-API</h1>
      <input placeholder="apiUrl" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} required />
      <input placeholder="idInstance" value={idInstance} onChange={(e) => setIdInstance(e.target.value)} required />
      <input
        placeholder="apiTokenInstance"
        value={apiTokenInstance}
        onChange={(e) => setApiTokenInstance(e.target.value)}
        required
      />
      <p className="hint">
        Учетные данные можно получить в{' '}
        <a href="https://console.green-api.com" target="_blank" rel="noreferrer">
          console.green-api.com
        </a>
      </p>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Проверка…' : 'Войти'}
      </button>
    </form>
  )
}
