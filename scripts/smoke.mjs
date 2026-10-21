// Server-side smoke test: renders every major UI state and asserts
// Indian Rupee formatting + absence of any "$" in output.
import { build } from 'esbuild'
import { mkdirSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

// Minimal browser globals so module-scope storage reads are safe under SSR.
globalThis.window = {
  localStorage: { getItem: () => null, setItem: () => {} },
  addEventListener: () => {},
  removeEventListener: () => {},
}
globalThis.document = { body: { style: {} } }

const outDir = path.resolve('.smoke')
mkdirSync(outDir, { recursive: true })

await build({
  entryPoints: ['scripts/smoke-entry.jsx'],
  outfile: path.join(outDir, 'smoke.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'node',
  jsx: 'automatic',
  logLevel: 'silent',
  external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/server'],
})

const mod = await import(pathToFileURL(path.join(outDir, 'smoke.mjs')).href)
const report = mod.run()

let failures = 0
const check = (label, ok, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? ` — ${detail}` : ''}`)
  if (!ok) failures += 1
}

check('App renders markup', report.appHtml.length > 2000)
check('Prices use ₹ (₹1,099 present)', report.appHtml.includes('₹1,099'))
check('Large price ₹22,999 present', report.appHtml.includes('₹22,999'))
check('No "$" anywhere in rendered output', !report.hasDollar, report.dollarSnippet)
check('8 products rendered', report.productCount === 8, `found ${report.productCount}`)
check('Cart drawer open renders line total ₹2,198', report.drawerHtml.includes('₹2,198'))
check('Cart drawer total shown', report.drawerHtml.includes('Total'))
check('Inventory shows Low stock badge', report.inventoryHtml.includes('Low stock'))
check('Inventory shows Out of stock badge', report.inventoryHtml.includes('Out of stock'))
check('Inventory shows low-stock warning count', report.inventoryHtml.includes('low-stock'))
check('Checkout form renders', report.checkoutHtml.includes('Place order'))
check('INR formatter output', report.formatted === '₹1,099', report.formatted)

console.log(failures === 0 ? '\nAll smoke checks passed.' : `\n${failures} check(s) failed.`)
process.exit(failures === 0 ? 0 : 1)
