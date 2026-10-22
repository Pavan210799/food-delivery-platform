import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'

const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line sm:mt-20">
      <div className="page-wrap grid gap-10 py-12 sm:grid-cols-2 sm:py-14 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to="/" className="inline-flex text-ink" aria-label="Marlow home">
            <Logo />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted">
            Six kitchens across downtown. Customize dinner, check out in minutes, and follow every order to the door.
          </p>
        </div>
        <div>
          <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-muted uppercase">Pages</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-copper">
                Home
              </Link>
            </li>
            <li>
              <Link to="/restaurants" className="hover:text-copper">
                Restaurants
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-copper">
                Orders
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-copper">
                Cart
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-muted uppercase">Service</p>
          <p className="mt-3 text-sm leading-7 text-muted">
            Open daily
            <br />
            5:00 PM – 11:30 PM
            <br />
            Last kitchen ticket at 11
          </p>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="page-wrap py-5 text-xs tracking-wide text-muted">© {year} Marlow</p>
      </div>
    </footer>
  )
}
