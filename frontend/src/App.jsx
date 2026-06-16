import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { InterviewProvider } from './context/InterviewContext'
import AppRoutes from './routes'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <InterviewProvider>
          <AppRoutes />
        </InterviewProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
