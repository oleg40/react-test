export interface Credentials {
  idInstance: string
  apiTokenInstance: string
}

export interface Notification {
  receiptId: number
  body: unknown
}

export function buildUrl(creds: Credentials, method: string, suffix = ''): string {
  const host = `https://${creds.idInstance.slice(0, 4)}.api.green-api.com`
  return `${host}/waInstance${creds.idInstance}/${method}/${creds.apiTokenInstance}${suffix}`
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  if (!response.ok) {
    throw new Error(`GREEN-API error ${response.status}`)
  }
  return response.json() as Promise<T>
}

export function sendMessage(creds: Credentials, chatId: string, message: string) {
  return request<{ idMessage: string }>(buildUrl(creds, 'sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  })
}

export function receiveNotification(creds: Credentials, signal?: AbortSignal) {
  return request<Notification | null>(buildUrl(creds, 'receiveNotification'), { signal })
}

export function deleteNotification(creds: Credentials, receiptId: number, signal?: AbortSignal) {
  return request<{ result: boolean }>(buildUrl(creds, 'deleteNotification', `/${receiptId}`), {
    method: 'DELETE',
    signal,
  })
}

export function getStateInstance(creds: Credentials) {
  return request<{ stateInstance: string }>(buildUrl(creds, 'getStateInstance'))
}
