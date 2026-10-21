import { useEffect } from 'react'
import { formatINR, formatNumber } from '../utils/format.js'

const SHIPPING_THRESHOLD = 499
const SHIPPING_FEE = 49

export default function CartDrawer({
  open,
  lines,
  total,
  onClose,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}) {
  useEffect(() => {
    if (!open) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  const shipping = total >= SHIPPING_THRESHOLD || total === 0 ? 0 : SHIPPING_FEE
  const grandTotal = total + shipping

  if (!open) return null

  return (
    <div className="drawer-root">
      <button
        type="button"
        className="drawer-overlay"
        aria-label="Close cart"
        onClick={onClose}
      />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Shopping cart">
        <header className="drawer-head">
          <h2>
            Your cart{' '}
            <span className="drawer-count">
              ({formatNumber(lines.reduce((sum, l) => sum + l.qty, 0))})
            </span>
          </h2>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close cart"
          >
            ✕
          </button>
        </header>

        <div className="drawer-body">
          {lines.length === 0 ? (
            <div className="drawer-empty">
              <span className="drawer-empty-icon" aria-hidden="true">🛒</span>
              <p>Your cart is empty.</p>
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Start shopping
              </button>
            </div>
          ) : (
            <ul className="cart-lines">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="cart-line">
                  <div
                    className="cart-line-media"
                    style={{ background: product.gradient }}
                    aria-hidden="true"
                  >
                    {product.emoji}
                  </div>
                  <div className="cart-line-info">
                    <div className="cart-line-top">
                      <h3>{product.name}</h3>
                      <button
                        type="button"
                        className="icon-btn icon-btn-danger"
                        onClick={() => onRemove(product.id)}
                        aria-label={`Remove ${product.name} from cart`}
                      >
                        🗑
                      </button>
                    </div>
                    <p className="cart-line-price">
                      {formatINR(product.price)}{' '}
                      <span className="cart-line-each">each</span>
                    </p>
                    <div className="cart-line-bottom">
                      <div className="qty-stepper" aria-label={`Quantity of ${product.name}`}>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span aria-live="polite">{formatNumber(qty)}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, 1)}
                          disabled={qty >= product.stock}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <strong className="cart-line-total">
                        {formatINR(qty * product.price)}
                      </strong>
                    </div>
                    {qty >= product.stock && (
                      <p className="cart-line-note">Max available stock reached</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="drawer-foot">
          <dl className="cart-summary">
            <div>
              <dt>Subtotal</dt>
              <dd>{formatINR(total)}</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd className={shipping === 0 ? 'text-success' : undefined}>
                {shipping === 0 ? 'FREE' : formatINR(shipping)}
              </dd>
            </div>
            <div className="cart-summary-total">
              <dt>Total</dt>
              <dd>{formatINR(grandTotal)}</dd>
            </div>
          </dl>
          {shipping > 0 && (
            <p className="cart-shipping-note">
              Add items worth {formatINR(SHIPPING_THRESHOLD - total)} more for free shipping.
            </p>
          )}
          <button
            type="button"
            className="btn btn-primary btn-lg btn-block"
            onClick={onCheckout}
            disabled={lines.length === 0}
          >
            Proceed to Checkout · {formatINR(grandTotal)}
          </button>
        </footer>
      </aside>
    </div>
  )
}
