import { useEffect, useState } from 'react'
import { formatINR, formatNumber } from '../utils/format.js'

const SHIPPING_THRESHOLD = 499
const SHIPPING_FEE = 49

export default function CheckoutModal({ open, lines, total, onClose, onPlaceOrder }) {
  const [placed, setPlaced] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      setPlaced(false)
      setErrors({})
    }
  }, [open])

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

  const shipping = total >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const grandTotal = total + shipping
  const itemCount = lines.reduce((sum, line) => sum + line.qty, 0)

  const submit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (name.trim().length < 2) nextErrors.name = 'Please enter your full name'
    if (!/^[6-9]\d{9}$/.test(phone.trim()))
      nextErrors.phone = 'Enter a valid 10-digit Indian mobile number'
    if (city.trim().length < 2) nextErrors.city = 'Please enter your city'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onPlaceOrder()
    setPlaced(true)
  }

  if (!open) return null

  return (
    <div className="modal-root">
      <button
        type="button"
        className="modal-overlay"
        aria-label="Close checkout"
        onClick={onClose}
      />
      <div className="modal" role="dialog" aria-modal="true" aria-label="Checkout">
        <header className="modal-head">
          <h2>{placed ? 'Order placed 🎉' : 'Checkout'}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        {placed ? (
          <div className="checkout-success">
            <span className="checkout-success-icon" aria-hidden="true">✅</span>
            <p>
              Thank you, <strong>{name.trim()}</strong>! Your order of{' '}
              {formatNumber(itemCount)} item{itemCount === 1 ? '' : 's'} has been placed.
            </p>
            <p className="checkout-success-total">Order total: {formatINR(grandTotal)}</p>
            <p className="checkout-success-note">
              A confirmation SMS will be sent to +91 {phone.trim()}. Arriving in 2–4 days.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-lg btn-block"
              onClick={onClose}
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <form className="checkout-form" onSubmit={submit} noValidate>
            <ul className="checkout-items">
              {lines.map(({ product, qty }) => (
                <li key={product.id}>
                  <span>
                    {product.emoji} {product.name} × {formatNumber(qty)}
                  </span>
                  <strong>{formatINR(qty * product.price)}</strong>
                </li>
              ))}
            </ul>

            <div className="field">
              <label htmlFor="checkout-name">Full name</label>
              <input
                id="checkout-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ananya Sharma"
                autoComplete="name"
              />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>

            <div className="field">
              <label htmlFor="checkout-phone">Mobile number</label>
              <input
                id="checkout-phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                autoComplete="tel-national"
              />
              {errors.phone && <p className="field-error">{errors.phone}</p>}
            </div>

            <div className="field">
              <label htmlFor="checkout-city">City</label>
              <input
                id="checkout-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Bengaluru"
                autoComplete="address-level2"
              />
              {errors.city && <p className="field-error">{errors.city}</p>}
            </div>

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
                <dt>Amount payable</dt>
                <dd>{formatINR(grandTotal)}</dd>
              </div>
            </dl>

            <button type="submit" className="btn btn-primary btn-lg btn-block">
              Place order · {formatINR(grandTotal)}
            </button>
            <p className="checkout-note">Pay on delivery · Cash, UPI and cards accepted</p>
          </form>
        )}
      </div>
    </div>
  )
}
