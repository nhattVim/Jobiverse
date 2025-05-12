const API_BASE = 'http://localhost:3000'

export default async function apiFetch(path, method = 'GET', body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...(body && { body: JSON.stringify(body) })
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, options)
    const contentType = res.headers.get('Content-Type')

    if (!res.ok) {
      const errorData = contentType && contentType.includes('application/json')
        ? await res.json()
        : await res.text()
      throw new Error(errorData.message || 'Lỗi mạng')
    }

    if (contentType.includes('application/json')) {
      return await res.json()
    }

    if (contentType.includes('application/pdf') || contentType.includes('application/octet-stream')) {
      const blob = await res.blob()
      return blob
    }

    return await res.text()
  } catch (error) {
    console.error(`API error [${method} ${path}]:`, error)
    throw error
  }
}
