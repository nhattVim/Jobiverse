const API_BASE = import.meta.env.VITE_API_URL

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
      if (res.status === 498) {
        localStorage.removeItem('user')
        window.location.href = '/'
        return undefined
      }

      let errorText
      try {
        errorText = contentType.includes('json') ? await res.json() : await res.text()
      } catch {
        errorText = 'Unknown error'
      }

      throw new Error(
        typeof errorText === 'string'
          ? errorText
          : typeof errorText?.message === 'string'
            ? errorText.message
            : JSON.stringify(errorText)
      )
    }

    if (contentType.includes('json')) return res.json()
    if (contentType.includes('pdf') || contentType.includes('octet-stream') || contentType.includes('png')) return res.blob()

    return res.text()
  } catch (err) {
    console.error(`[${method} ${path}]`, err)
    throw err
  }
}
