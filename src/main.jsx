import { FavoriteProvider } from './hooks/context/FavoriteProvider.jsx';
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <FavoriteProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </FavoriteProvider>,
)
