import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="p-4 text-2xl font-bold text-blue-600">Inventory App</div>
  </StrictMode>
)
