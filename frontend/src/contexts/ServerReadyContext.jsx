import React, { createContext, useEffect, useState } from 'react'

const ServerReadyContext = createContext(false)

export function ServerReadyProvider({ children }) {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const ping = async (retry = 0, maxRetry = 15, delay = 2000) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/health-check`)
        if (res.ok) {
          setReady(true)
        } else {
          throw new Error('Server chưa sẵn sàng')
        }
      } catch {
        if (retry < maxRetry) {
          setTimeout(() => ping(retry + 1, maxRetry, delay), delay)
        } else {
          setError('Không thể kết nối đến server. Vui lòng thử lại sau.')
        }
      }
    }

    ping()
  }, [])

  if (error) return <ErrorScreen message={error} />
  if (!ready) return <LoadingScreen />

  return <ServerReadyContext.Provider value={true}>{children}</ServerReadyContext.Provider>
}

function ErrorScreen({ message }) {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <p className="text-lg text-red-600">{message}</p>
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        <p className="text-lg text-gray-700">Đang khởi động server, vui lòng chờ một chút...</p>
      </div>
    </div>
  )
}

export { ServerReadyContext }
