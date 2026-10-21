// Indian Rupee formatting with Indian digit grouping (e.g. ₹1,29,999).
const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const numFormatter = new Intl.NumberFormat('en-IN')

/** Formats a number as Indian Rupees, e.g. 1299 -> "₹1,299" (never a dollar sign). */
export function formatINR(value) {
  const n = Number(value)
  return inrFormatter.format(Number.isFinite(n) ? Math.round(n) : 0)
}

/** Indian digit grouping without the currency symbol, e.g. 129999 -> "1,29,999". */
export function formatNumber(value) {
  const n = Number(value)
  return numFormatter.format(Number.isFinite(n) ? n : 0)
}
