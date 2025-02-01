// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import AppContextProivder from './context/AppContext.jsx';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AppContextProivder>
    <App />
  </AppContextProivder>
  </BrowserRouter>,
)

