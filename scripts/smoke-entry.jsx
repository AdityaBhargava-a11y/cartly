import { renderToStaticMarkup } from 'react-dom/server'
import App from '../src/App.jsx'
import CartDrawer from '../src/components/CartDrawer.jsx'
import CheckoutModal from '../src/components/CheckoutModal.jsx'
import InventoryPanel from '../src/components/InventoryPanel.jsx'
import { seedProducts } from '../src/data/products.js'
import { formatINR } from '../src/utils/format.js'

export function run() {
  const cartLines = [
    { product: seedProducts[0], qty: 2 }, // boAt Airdopes ₹1,099 x2
    { product: seedProducts[3], qty: 1 }, // Wildcraft ₹1,299 x1
  ]

  const appHtml = renderToStaticMarkup(<App />)
  const drawerHtml = renderToStaticMarkup(
    <CartDrawer
      open
      lines={cartLines}
      total={2199 * 0 + 1099 * 2 + 1299}
      onClose={() => {}}
      onUpdateQuantity={() => {}}
      onRemove={() => {}}
      onCheckout={() => {}}
    />,
  )
  // Include a zero-stock item to exercise the out-of-stock warning path.
  const inventoryProducts = [
    ...seedProducts,
    { ...seedProducts[1], id: 'p-test-oos', name: 'Sold Out Test Item', stock: 0 },
  ]
  const inventoryHtml = renderToStaticMarkup(
    <InventoryPanel
      open
      products={inventoryProducts}
      onClose={() => {}}
      onSave={() => {}}
      onDelete={() => {}}
      onAdjustStock={() => {}}
    />,
  )
  const checkoutHtml = renderToStaticMarkup(
    <CheckoutModal
      open
      lines={cartLines}
      total={3497}
      onClose={() => {}}
      onPlaceOrder={() => {}}
    />,
  )

  const combined = [appHtml, drawerHtml, inventoryHtml, checkoutHtml].join('\n')
  const dollarIndex = combined.indexOf('$')

  return {
    appHtml,
    drawerHtml,
    inventoryHtml,
    checkoutHtml,
    hasDollar: dollarIndex !== -1,
    dollarSnippet: dollarIndex === -1 ? '' : combined.slice(Math.max(0, dollarIndex - 60), dollarIndex + 60),
    productCount: (appHtml.match(/class="product-card"/g) || []).length,
    formatted: formatINR(1099),
  }
}
