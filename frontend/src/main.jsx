import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import UserProvider from './contexts/UserProvider'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <GoogleOAuthProvider clientId="635002964281-ot6df7tfd9c9uut42a2s39oaq31u5q5j.apps.googleusercontent.com">
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </UserProvider>
  </React.StrictMode >
)
