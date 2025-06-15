import React, { createContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user))
  }, [user])

  const updateTimestamp = () => {
    setUser(prevUser => {
      if (!prevUser) return null
      return {
        ...prevUser,
        avatarTimestamp: Date.now()
      }
    })
  }

  return (
    <UserContext.Provider value={{ user, setUser, updateTimestamp }}>
      {children}
    </UserContext.Provider>
  )
}

export { UserContext }
