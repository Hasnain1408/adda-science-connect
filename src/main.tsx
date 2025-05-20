
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create a single root element
const container = document.getElementById('root')
if (!container) throw new Error('Root element not found')

// Create a stable root
const root = createRoot(container)

// Render with StrictMode for development best practices
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
