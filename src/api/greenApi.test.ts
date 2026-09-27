import { afterEach, describe, expect, it, vi } from 'vitest'
import { deleteNotification, getStateInstance, receiveNotification, sendMessage } from './greenApi'

const BASE = 'https://4100.api.green-api.com/waInstance4100227483'
const creds = { idInstance: '4100227483', apiTokenInstance: 'token' }

function mockFetch(data: unknown, ok = true) {
  const fn = vi.fn().mockResolvedValue({ ok, status: ok ? 200 : 401, json: () => Promise.resolve(data) })
  vi.stubGlobal('fetch', fn)
  return fn
}

afterEach(() => vi.unstubAllGlobals())

describe('greenApi', () => {
  it('sends message', async () => {
    const fetch = mockFetch({ idMessage: 'id1' })
    await expect(sendMessage(creds, '79001234567@c.us', 'hello')).resolves.toEqual({ idMessage: 'id1' })
    const [url, init] = fetch.mock.calls[0]
    expect(url).toBe(`${BASE}/sendMessage/token`)
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toEqual({ chatId: '79001234567@c.us', message: 'hello' })
  })

  it('receives notification', async () => {
    const fetch = mockFetch(null)
    await expect(receiveNotification(creds)).resolves.toBeNull()
    expect(fetch.mock.calls[0][0]).toBe(`${BASE}/receiveNotification/token`)
  })

  it('deletes notification', async () => {
    const fetch = mockFetch({ result: true })
    await deleteNotification(creds, 42)
    expect(fetch.mock.calls[0][0]).toBe(`${BASE}/deleteNotification/token/42`)
    expect(fetch.mock.calls[0][1].method).toBe('DELETE')
  })

  it('gets instance state', async () => {
    const fetch = mockFetch({ stateInstance: 'authorized' })
    await getStateInstance(creds)
    expect(fetch.mock.calls[0][0]).toBe(`${BASE}/getStateInstance/token`)
  })

  it('throws on http error', async () => {
    mockFetch({}, false)
    await expect(receiveNotification(creds)).rejects.toThrow('GREEN-API error 401')
  })
})
