import { formatINR, formatNumber } from '../utils/format.js'
import { LOW_STOCK_THRESHOLD } from '../data/products.js'

function stockBadge(product, qtyInCart) {
  if (product.stock <= 0) {
    return <span className="badge badge-out">Out of stock</span>
  }
  const remaining = product.stock - qtyInCart
  if (product.stock <= LOW_STOCK_THRESHOLD) {
    return (
      <span className="badge badge-low">
        Only {formatNumber(remaining)} left — low stock
      </span>
    )
  }
  return <span className="badge badge-in">In stock</span>
}

export default function ProductGrid({ products, onAddToCart, cart }) {
  return (
    <section className="section" id="products">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Trending today</h2>
            <p className="section-sub">Handpicked favourites, delivered pan-India.</p>
          </div>
          <span className="section-count">
            {formatNumber(products.length)} products
          </span>
        </div>

        <div className="product-grid">
          {products.map((product) => {
            const qtyInCart =
              cart.find((item) => item.id === product.id)?.qty ?? 0
            const soldOut = product.stock <= 0
            const atMax = qtyInCart >= product.stock
            return (
              <article key={product.id} className="product-card">
                <div
                  className="product-media"
                  style={{ background: product.gradient }}
                  aria-hidden="true"
                >
                  <span className="product-emoji">{product.emoji}</span>
                  <span className="product-category">{product.category}</span>
                </div>
                <div className="product-body">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-desc">{product.description}</p>
                  <div className="product-meta">
                    <div className="product-price">
                      {formatINR(product.price)}
                      <span className="product-mrp-note">Inclusive of all taxes</span>
                    </div>
                    {stockBadge(product, qtyInCart)}
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary product-add"
                    onClick={() => onAddToCart(product)}
                    disabled={soldOut || atMax}
                  >
                    {soldOut
                      ? 'Out of stock'
                      : atMax
                        ? 'Max in cart'
                        : qtyInCart > 0
                          ? `Add more (${formatNumber(qtyInCart)} in cart)`
                          : 'Add to Cart'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        {products.length === 0 && (
          <div className="empty-state">
            <p>No products yet. Open Inventory to add your first product.</p>
          </div>
        )}
      </div>
    </section>
  )
}
