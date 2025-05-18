const API_BASE = 'http://localhost:3000'

export default async function apiFetch(path, method = 'GET', body = null) {
  const isFormData = body instanceof FormData

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      credentials: 'include',
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined
    })

    const contentType = res.headers.get('Content-Type') || ''

    if (!res.ok) {
      const error = contentType.includes('json') ? await res.json() : await res.text()
      throw new Error(error?.message || error || 'Lỗi mạng')
    }

    if (contentType.includes('json')) return res.json()
    if (contentType.includes('pdf') || contentType.includes('octet-stream') || contentType.includes('png')) return res.blob()

    return res.text()
  } catch (err) {
    console.error(`[${method} ${path}]`, err)
    throw err
  }
}
