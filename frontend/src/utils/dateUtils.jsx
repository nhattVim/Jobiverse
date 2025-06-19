export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const formattedDate = date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
  return `${formattedDate}`
}
