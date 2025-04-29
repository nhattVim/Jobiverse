const API_BASE = "http://localhost:3000";

export default async function apiFetch(path, method = "GET", body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Lỗi mạng");
  }

  return data;
}
