import React, { useState, useEffect } from 'react'
import UserContext from './UserContext'

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user))
  }, [user])

  const updateTimestamp = () => {
    setUser(prevUser => ({
      ...prevUser,
      avatarTimestamp: Date.now()
    }))
  }

  return (
    <UserContext.Provider value={{ user, setUser, updateTimestamp }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
