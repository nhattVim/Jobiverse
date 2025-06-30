import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { UserProvider } from './contexts/UserContext'
import { ApplicationStatusProvider } from './contexts/ApplicationStatusContext'
import { ServerReadyProvider } from './contexts/ServerReadyContext'
import './index.css'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ServerReadyProvider>
      <UserProvider>
        <GoogleOAuthProvider clientId="635002964281-ot6df7tfd9c9uut42a2s39oaq31u5q5j.apps.googleusercontent.com">
          <ApplicationStatusProvider>
            <RouterProvider router={router} />
          </ApplicationStatusProvider>
        </GoogleOAuthProvider>
      </UserProvider>
    </ServerReadyProvider>
  </React.StrictMode >
)
