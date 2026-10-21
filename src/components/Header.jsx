import { formatNumber } from '../utils/format.js'

export default function Header({ cartCount, onCartClick, onInventoryClick }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <a className="brand" href="#top" aria-label="Cartly home">
          <span className="brand-mark" aria-hidden="true">🛒</span>
          <span className="brand-name">Cartly</span>
        </a>

        <nav className="header-nav" aria-label="Primary">
          <a href="#products">Shop</a>
          <a href="#products">Deals</a>
          <a href="#products">New Arrivals</a>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onInventoryClick}
            title="Manage inventory"
          >
            <span aria-hidden="true">📦</span>
            <span className="btn-label-desktop">Inventory</span>
          </button>
          <button
            type="button"
            className="btn btn-primary cart-button"
            onClick={onCartClick}
            aria-label={`Open cart, ${formatNumber(cartCount)} items`}
          >
            <span aria-hidden="true">🛍️</span>
            <span className="btn-label-desktop">Cart</span>
            {cartCount > 0 && <span className="cart-badge">{formatNumber(cartCount)}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}
