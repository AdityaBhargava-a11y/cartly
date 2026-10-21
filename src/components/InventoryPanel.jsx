import { useEffect, useState } from 'react'
import { formatINR, formatNumber } from '../utils/format.js'
import { LOW_STOCK_THRESHOLD, gradientFor } from '../data/products.js'

const EMOJI_CHOICES = ['🎧', '📺', '🍳', '🎒', '🥤', '👟', '👖', '🔋', '📱', '⌚', '🪑', '🧸']

const EMPTY_FORM = {
  id: null,
  name: '',
  description: '',
  category: '',
  price: '',
  stock: '',
  emoji: '🛍️',
}

export default function InventoryPanel({
  open,
  products,
  onClose,
  onSave,
  onDelete,
  onAdjustStock,
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [showForm, setShowForm] = useState(false)
  const [errors, setErrors] = useState({})
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

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

  const lowStockCount = products.filter(
    (p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD,
  ).length
  const outOfStockCount = products.filter((p) => p.stock <= 0).length
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0)
  const inventoryValue = products.reduce((sum, p) => sum + p.stock * p.price, 0)

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const startAdd = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setShowForm(true)
  }

  const startEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      emoji: product.emoji,
      gradient: product.gradient,
    })
    setErrors({})
    setShowForm(true)
  }

  const submit = (event) => {
    event.preventDefault()
    const price = Number(form.price)
    const stock = Number(form.stock)
    const nextErrors = {}
    if (form.name.trim().length < 2) nextErrors.name = 'Product name is required'
    if (form.category.trim().length < 2) nextErrors.category = 'Category is required'
    if (!Number.isFinite(price) || price <= 0) nextErrors.price = 'Enter a price above ₹0'
    if (!Number.isInteger(stock) || stock < 0) nextErrors.stock = 'Stock must be a whole number (0 or more)'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSave({
      id: form.id ?? undefined,
      name: form.name.trim(),
      description: form.description.trim() || 'A great product from Cartly.',
      category: form.category.trim(),
      price: Math.round(price),
      stock,
      emoji: form.emoji || '🛍️',
      gradient: form.gradient,
    })
    setShowForm(false)
    setForm(EMPTY_FORM)
  }

  if (!open) return null

  return (
    <div className="modal-root">
      <button
        type="button"
        className="modal-overlay"
        aria-label="Close inventory panel"
        onClick={onClose}
      />
      <div
        className="modal modal-wide"
        role="dialog"
        aria-modal="true"
        aria-label="Inventory management"
      >
        <header className="modal-head">
          <div>
            <h2>📦 Inventory Management</h2>
            <p className="modal-sub">
              {formatNumber(products.length)} products · {formatNumber(totalUnits)} units
              in stock · value {formatINR(inventoryValue)}
            </p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="inventory-alerts">
          <span className={lowStockCount > 0 ? 'alert alert-warn' : 'alert alert-ok'}>
            ⚠️ {formatNumber(lowStockCount)} low-stock
            {lowStockCount === 1 ? '' : 's'} (≤ {formatNumber(LOW_STOCK_THRESHOLD)} units)
          </span>
          <span className={outOfStockCount > 0 ? 'alert alert-danger' : 'alert alert-ok'}>
            🛑 {formatNumber(outOfStockCount)} out of stock
          </span>
          {!showForm && (
            <button type="button" className="btn btn-primary" onClick={startAdd}>
              + Add product
            </button>
          )}
        </div>

        {showForm && (
          <form className="inventory-form" onSubmit={submit} noValidate>
            <h3>{form.id ? 'Edit product' : 'Add new product'}</h3>
            <div className="inventory-form-grid">
              <div className="field field-span-2">
                <label htmlFor="inv-name">Product name</label>
                <input
                  id="inv-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  placeholder="e.g. Prestige Induction Cooktop"
                />
                {errors.name && <p className="field-error">{errors.name}</p>}
              </div>
              <div className="field">
                <label htmlFor="inv-category">Category</label>
                <input
                  id="inv-category"
                  type="text"
                  value={form.category}
                  onChange={(e) => setField('category', e.target.value)}
                  placeholder="e.g. Kitchen"
                />
                {errors.category && <p className="field-error">{errors.category}</p>}
              </div>
              <div className="field">
                <label htmlFor="inv-price">Price (₹)</label>
                <input
                  id="inv-price"
                  type="number"
                  min="1"
                  step="1"
                  value={form.price}
                  onChange={(e) => setField('price', e.target.value)}
                  placeholder="1499"
                />
                {errors.price && <p className="field-error">{errors.price}</p>}
              </div>
              <div className="field">
                <label htmlFor="inv-stock">Stock quantity</label>
                <input
                  id="inv-stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(e) => setField('stock', e.target.value)}
                  placeholder="10"
                />
                {errors.stock && <p className="field-error">{errors.stock}</p>}
              </div>
              <div className="field">
                <label htmlFor="inv-desc">Short description</label>
                <input
                  id="inv-desc"
                  type="text"
                  value={form.description}
                  onChange={(e) => setField('description', e.target.value)}
                  placeholder="One-line product highlight"
                />
              </div>
              <div className="field field-span-2">
                <label>Product icon</label>
                <div className="emoji-picker" role="radiogroup" aria-label="Product icon">
                  {EMOJI_CHOICES.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      role="radio"
                      aria-checked={form.emoji === emoji}
                      className={form.emoji === emoji ? 'emoji-option is-selected' : 'emoji-option'}
                      onClick={() => setField('emoji', emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="inventory-form-actions">
              <button type="submit" className="btn btn-primary">
                {form.id ? 'Save changes' : 'Add product'}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setShowForm(false)
                  setForm(EMPTY_FORM)
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="inventory-table-wrap">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const status =
                  product.stock <= 0
                    ? { cls: 'badge-out', label: 'Out of stock' }
                    : product.stock <= LOW_STOCK_THRESHOLD
                      ? { cls: 'badge-low', label: 'Low stock' }
                      : { cls: 'badge-in', label: 'In stock' }
                const isEditingRow = form.id === product.id && showForm
                return (
                  <tr
                    key={product.id}
                    className={`${status.cls === 'badge-out' ? 'row-out' : ''} ${
                      status.cls === 'badge-low' ? 'row-low' : ''
                    } ${isEditingRow ? 'row-editing' : ''}`}
                  >
                    <td>
                      <div className="inv-product">
                        <span
                          className="inv-thumb"
                          style={{ background: product.gradient }}
                          aria-hidden="true"
                        >
                          {product.emoji}
                        </span>
                        <div>
                          <strong>{product.name}</strong>
                          <span className="inv-category">{product.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="inv-price">{formatINR(product.price)}</td>
                    <td>
                      <div className="stock-control">
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => onAdjustStock(product.id, -1)}
                          disabled={product.stock <= 0}
                          aria-label={`Decrease stock of ${product.name}`}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={product.stock}
                          onChange={(e) => {
                            const value = Number(e.target.value)
                            if (Number.isFinite(value)) {
                              onAdjustStock(
                                product.id,
                                Math.max(0, value) - product.stock,
                              )
                            }
                          }}
                          aria-label={`Stock quantity of ${product.name}`}
                        />
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => onAdjustStock(product.id, 1)}
                          aria-label={`Increase stock of ${product.name}`}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${status.cls}`}>{status.label}</span>
                    </td>
                    <td>
                      <div className="inv-actions">
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => startEdit(product)}
                        >
                          Edit
                        </button>
                        {confirmDeleteId === product.id ? (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              onDelete(product.id)
                              setConfirmDeleteId(null)
                            }}
                          >
                            Confirm delete?
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm btn-danger-text"
                            onClick={() => setConfirmDeleteId(product.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="empty-state">
              <p>Inventory is empty. Use “+ Add product” to create your first product.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
