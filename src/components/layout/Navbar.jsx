import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useKitchenQuery } from '../../hooks/useKitchenQuery'
import { BagIcon, CloseIcon } from '../ui/Icons'
import Logo from '../ui/Logo'
import SearchField from '../ui/SearchField'

export default function Navbar() {
  const { count } = useCart()
  const { query, update, clearSearch, onHome, searching } = useKitchenQuery()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [openPath, setOpenPath] = useState(location.pathname)

  if (openPath !== location.pathname) {
    setOpenPath(location.pathname)
    setOpen(false)
  }

  function goHome() {
    if (searching) clearSearch()
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/85 backdrop-blur-md">
      <div className="page-wrap flex h-16 min-w-0 items-center gap-2 sm:gap-3 md:gap-4">
        <Link
          to="/"
          onClick={goHome}
          className="shrink-0 rounded-xl text-ink"
          aria-label="Marlow home"
        >
          <Logo compactMobile markClassName="h-8 w-8 sm:h-9 sm:w-9" />
        </Link>

        <nav className="ml-1 hidden items-center gap-5 md:flex" aria-label="Primary">
          <Link
            to="/"
            onClick={goHome}
            className={`text-sm font-medium ${onHome && !searching ? 'text-ink' : 'text-muted hover:text-ink'}`}
          >
            Home
          </Link>
          <NavLink
            to="/restaurants"
            className={({ isActive }) =>
              `text-sm font-medium ${isActive ? 'text-ink' : 'text-muted hover:text-ink'}`
            }
          >
            Restaurants
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `text-sm font-medium ${isActive ? 'text-ink' : 'text-muted hover:text-ink'}`
            }
          >
            Orders
          </NavLink>
        </nav>

        <div className="ml-auto min-w-0 flex-1 basis-0 max-w-none sm:max-w-xs md:max-w-sm">
          <SearchField
            id="nav-search"
            value={query}
            onChange={(value) => update({ q: value })}
            onSubmit={(value) => update({ q: value })}
            placeholder="Search kitchens or dishes"
          />
        </div>

        <NavLink
          to="/cart"
          className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-ink sm:h-11 sm:w-11"
          aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
        >
          <BagIcon />
          {count > 0 ? (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-copper px-1 text-[10px] font-bold text-paper tabular-nums">
              {count}
            </span>
          ) : null}
        </NavLink>

        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-paper sm:h-11 sm:w-11 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          {open ? <CloseIcon /> : <MenuGlyph />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line bg-cream md:hidden"
          >
            <div className="page-wrap flex flex-col gap-1 py-4">
              <MobileNavLink
                to="/"
                onClick={() => {
                  goHome()
                  setOpen(false)
                }}
                active={onHome && !searching}
              >
                Home
              </MobileNavLink>
              <MobileNavLink
                to="/restaurants"
                onClick={() => setOpen(false)}
                active={location.pathname === '/restaurants'}
              >
                Restaurants
              </MobileNavLink>
              <MobileNavLink
                to="/orders"
                onClick={() => setOpen(false)}
                active={location.pathname.startsWith('/orders')}
              >
                Orders
              </MobileNavLink>
              <MobileNavLink
                to="/cart"
                onClick={() => setOpen(false)}
                active={location.pathname === '/cart' || location.pathname === '/checkout'}
              >
                Cart
              </MobileNavLink>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

function MobileNavLink({ to, onClick, active, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`rounded-xl px-1 py-3 font-display text-[1.35rem] tracking-[-0.03em] transition ${
        active ? 'font-semibold text-ink' : 'font-medium text-muted hover:text-ink'
      }`}
    >
      {children}
    </Link>
  )
}

function MenuGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M2 5h14M2 9h14M2 13h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
