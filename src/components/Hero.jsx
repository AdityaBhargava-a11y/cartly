export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="hero-eyebrow">Free delivery across India 🇮🇳</span>
          <h1>
            Everything you love,
            <br />
            at prices that feel <span className="hero-accent">just right</span>.
          </h1>
          <p>
            From kitchen essentials to the latest gadgets — shop thousands of products
            with transparent pricing in ₹, quick dispatch and easy returns.
          </p>
          <div className="hero-cta">
            <a className="btn btn-primary btn-lg" href="#products">
              Shop now
            </a>
            <a className="btn btn-outline btn-lg" href="#products">
              Today&apos;s deals
            </a>
          </div>
          <ul className="hero-stats">
            <li>
              <strong>10L+</strong>
              <span>Happy customers</span>
            </li>
            <li>
              <strong>24 hrs</strong>
              <span>Fast dispatch</span>
            </li>
            <li>
              <strong>7 days</strong>
              <span>Easy returns</span>
            </li>
          </ul>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-card hero-card-1">🎧</div>
          <div className="hero-card hero-card-2">👟</div>
          <div className="hero-card hero-card-3">📱</div>
          <div className="hero-blob" />
        </div>
      </div>
    </section>
  )
}
