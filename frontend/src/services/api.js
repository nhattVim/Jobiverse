const API_BASE = 'http://localhost:3000'

export default async function apiFetch(path, method = 'GET', body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  }

  if (body) options.body = JSON.stringify(body)

  try {
    const res = await fetch(`${API_BASE}${path}`, options)
    const contentType = res.headers.get('Content-Type')

    let data
    if (contentType && contentType.includes('application/json')) {
      data = await res.json()
    } else {
      data = await res.text()
    }

    if (!res.ok) throw new Error(data.message || 'Lỗi mạng')

    return data
  } catch (error) {
    console.error(`API error [${method} ${path}]:`, error)
    throw error
  }
}
