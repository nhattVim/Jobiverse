import React, { useState, useEffect } from 'react'
import UserContext from './UserContext'

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({})

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    if (storedUser) setUser(storedUser)
  }, [])

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
