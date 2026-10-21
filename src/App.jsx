import { useCallback, useEffect, useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import ProductGrid from './components/ProductGrid.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import InventoryPanel from './components/InventoryPanel.jsx'
import CheckoutModal from './components/CheckoutModal.jsx'
import { seedProducts } from './data/products.js'

const STORAGE_KEY = 'cartly-state-v1'

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed?.products) || parsed.products.length === 0) return null
    return parsed
  } catch {
    return null
  }
}

export default function App() {
  const saved = loadState()
  const [products, setProducts] = useState(() => saved?.products ?? seedProducts)
  const [cart, setCart] = useState(() => saved?.cart ?? [])
  const [cartOpen, setCartOpen] = useState(false)
  const [inventoryOpen, setInventoryOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ products, cart }))
    } catch {
      /* storage may be unavailable; in-memory state still works */
    }
  }, [products, cart])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), 2500)
    return () => window.clearTimeout(timer)
  }, [toast])

  const productById = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products],
  )

  // Cart lines joined with live product data; drop lines whose product was deleted.
  const cartLines = useMemo(
    () =>
      cart
        .map(({ id, qty }) => {
          const product = productById.get(id)
          return product ? { product, qty: Math.min(qty, product.stock) } : null
        })
        .filter((line) => line && line.qty > 0),
    [cart, productById],
  )

  const cartCount = useMemo(
    () => cartLines.reduce((sum, line) => sum + line.qty, 0),
    [cartLines],
  )
  const cartTotal = useMemo(
    () => cartLines.reduce((sum, line) => sum + line.qty * line.product.price, 0),
    [cartLines],
  )

  const addToCart = useCallback(
    (product) => {
      const inCart = cart.find((item) => item.id === product.id)?.qty ?? 0
      if (product.stock <= 0) {
        setToast({ kind: 'error', message: `${product.name} is out of stock` })
        return
      }
      if (inCart >= product.stock) {
        setToast({ kind: 'error', message: `Only ${product.stock} left in stock` })
        return
      }
      setCart((prev) => {
        const existing = prev.find((item) => item.id === product.id)
        if (existing) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
          )
        }
        return [...prev, { id: product.id, qty: 1 }]
      })
      setToast({ kind: 'success', message: `${product.name} added to cart` })
    },
    [cart],
  )

  const updateQuantity = useCallback((id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item
          const stock = productById.get(id)?.stock ?? 0
          return { ...item, qty: Math.max(0, Math.min(item.qty + delta, stock)) }
        })
        .filter((item) => item.qty > 0),
    )
  }, [productById])

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }, [])

  // ---------- Inventory actions ----------
  const saveProduct = useCallback((draft) => {
    setProducts((prev) => {
      if (draft.id) {
        return prev.map((p) => (p.id === draft.id ? { ...p, ...draft } : p))
      }
      const id = `p${Date.now()}`
      return [
        ...prev,
        {
          ...draft,
          id,
          gradient: draft.gradient ?? seedProducts[prev.length % seedProducts.length].gradient,
        },
      ]
    })
    setToast({
      kind: 'success',
      message: draft.id ? 'Product updated' : 'Product added to catalogue',
    })
  }, [])

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    setCart((prev) => prev.filter((item) => item.id !== id))
    setToast({ kind: 'success', message: 'Product deleted' })
  }, [])

  const adjustStock = useCallback((id, delta) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p,
      ),
    )
  }, [])

  // ---------- Checkout ----------
  const placeOrder = useCallback(() => {
    setProducts((prev) =>
      prev.map((p) => {
        const line = cartLines.find((l) => l.product.id === p.id)
        return line ? { ...p, stock: Math.max(0, p.stock - line.qty) } : p
      }),
    )
    setCart([])
  }, [cartLines])

  return (
    <div className="app">
      <Header
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onInventoryClick={() => setInventoryOpen(true)}
      />
      <main>
        <Hero />
        <ProductGrid products={products} onAddToCart={addToCart} cart={cart} />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <span className="footer-brand">🛒 Cartly</span>
          <span>Prices in Indian Rupees (₹) · Free shipping on orders above ₹499</span>
        </div>
      </footer>

      <CartDrawer
        open={cartOpen}
        lines={cartLines}
        total={cartTotal}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={() => {
          setCartOpen(false)
          setCheckoutOpen(true)
        }}
      />

      <InventoryPanel
        open={inventoryOpen}
        products={products}
        onClose={() => setInventoryOpen(false)}
        onSave={saveProduct}
        onDelete={deleteProduct}
        onAdjustStock={adjustStock}
      />

      <CheckoutModal
        open={checkoutOpen}
        lines={cartLines}
        total={cartTotal}
        onClose={() => setCheckoutOpen(false)}
        onPlaceOrder={placeOrder}
      />

      {toast && (
        <div className={`toast toast--${toast.kind}`} role="status" aria-live="polite">
          {toast.message}
        </div>
      )}
    </div>
  )
}
