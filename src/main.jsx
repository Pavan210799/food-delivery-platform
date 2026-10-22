import { MotionConfig } from 'framer-motion'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { OrdersProvider } from './context/OrdersContext.jsx'
import { SplashProvider } from './context/SplashContext.jsx'
import { KitchenQueryProvider } from './hooks/useKitchenQuery.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <CartProvider>
          <OrdersProvider>
            <SplashProvider>
              <KitchenQueryProvider>
                <App />
              </KitchenQueryProvider>
            </SplashProvider>
          </OrdersProvider>
        </CartProvider>
      </MotionConfig>
    </BrowserRouter>
  </StrictMode>,
)
