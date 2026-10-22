import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import HomeGate from './components/auth/HomeGate'
import RequireAuth from './components/auth/RequireAuth'
import SwitchDialog from './components/cart/SwitchDialog'
import CartPill from './components/layout/CartPill'
import Footer from './components/layout/Footer'
import Navbar from './components/layout/Navbar'
import PageLoader from './components/layout/PageLoader'
import { useAuth } from './context/AuthContext'
import { useCart } from './context/CartContext'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import LoginPage from './pages/auth/LoginPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import OrdersPage from './pages/OrdersPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import RestaurantPage from './pages/RestaurantPage'
import RestaurantsPage from './pages/RestaurantsPage'
import SignupPage from './pages/auth/SignupPage'
import SignupSuccessPage from './pages/auth/SignupSuccessPage'

const AUTH_PREFIXES = ['/login', '/signup', '/forgot-password', '/reset-password', '/signup-success']

export default function App() {
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const { count } = useCart()
  const isAuthRoute = AUTH_PREFIXES.some((path) => location.pathname.startsWith(path))
  const showPill =
    !isAuthRoute &&
    count > 0 &&
    location.pathname !== '/cart' &&
    location.pathname !== '/checkout' &&
    !location.pathname.startsWith('/orders')

  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash)
      if (target) {
        window.requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth' }))
        return
      }
    }
    window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  // Opening the site link as a guest always starts on login.
  if (!isAuthenticated && location.pathname === '/') {
    return <Navigate to="/login" replace />
  }

  return (
    <div className={showPill ? 'pb-24 md:pb-0' : undefined}>
      {!isAuthRoute ? <PageLoader /> : null}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-cream"
      >
        Skip to content
      </a>
      {!isAuthRoute ? <Navbar /> : null}
      <main id="main">
        <Routes>
          <Route path="/" element={<HomeGate />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <CheckoutPage />
              </RequireAuth>
            }
          />
          <Route
            path="/orders"
            element={
              <RequireAuth>
                <OrdersPage />
              </RequireAuth>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <RequireAuth>
                <OrderConfirmationPage />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup-success" element={<SignupSuccessPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      {!isAuthRoute ? <Footer /> : null}
      <CartPill />
      <SwitchDialog />
    </div>
  )
}
