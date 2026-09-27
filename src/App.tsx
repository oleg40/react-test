import { useCallback, useEffect, useState } from 'react'
import { Credentials } from './api/greenApi'
import { Chat } from './components/Chat'
import { LoginForm } from './components/LoginForm'
import { NewChatForm } from './components/NewChatForm'
import { Message } from './lib/parseNotification'

const STORAGE_KEY = 'green-api-chat'

interface State {
  creds: Credentials | null
  chatId: string | null
  messages: Message[]
}

const emptyState: State = { creds: null, chatId: null, messages: [] }

function loadState(): State {
  try {
    return { ...emptyState, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') }
  } catch {
    return emptyState
  }
}

export default function App() {
  const [state, setState] = useState<State>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const addMessage = useCallback((message: Message) => {
    setState((prev) =>
      prev.messages.some((m) => m.id === message.id) ? prev : { ...prev, messages: [...prev.messages, message] },
    )
  }, [])

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setState(emptyState)
  }

  if (!state.creds) {
    return <LoginForm onLogin={(creds) => setState({ ...emptyState, creds })} />
  }

  if (!state.chatId) {
    return (
      <NewChatForm
        onCreate={(chatId) => setState((prev) => ({ ...prev, chatId, messages: [] }))}
        onLogout={logout}
      />
    )
  }

  return (
    <Chat
      creds={state.creds}
      chatId={state.chatId}
      messages={state.messages}
      onMessage={addMessage}
      onNewChat={() => setState((prev) => ({ ...prev, chatId: null, messages: [] }))}
      onLogout={logout}
    />
  )
}
