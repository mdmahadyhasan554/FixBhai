/**
 * src/assets/index.js — Central asset barrel export.
 * Import assets from here instead of using relative paths everywhere.
 *
 *   import { logo, acIcon, SERVICE_ICONS } from '../assets'
 */

// ── Logos ─────────────────────────────────────────────────
import _logo from './logos/fixbhai-logo.png'

export const logo     = _logo   // full horizontal logo
export const logoIcon = _logo   // swap for fixbhai-icon.png when available

// ── Service icons (SVG) ───────────────────────────────────
import acIcon          from './icons/ac.svg'
import electricianIcon from './icons/electrician.svg'
import plumberIcon     from './icons/plumber.svg'

export { acIcon, electricianIcon, plumberIcon }

// ── Service icon map — keyed by service name ──────────────
export const SERVICE_ICONS = {
  'AC Repair':  acIcon,
  'Electrical': electricianIcon,
  'Plumbing':   plumberIcon,
}

// ── Dynamic image path helpers ────────────────────────────
export const serviceImage = (f) => new URL(`./images/services/${f}`,    import.meta.url).href
export const bannerImage  = (f) => new URL(`./images/banners/${f}`,     import.meta.url).href
export const bgImage      = (f) => new URL(`./images/backgrounds/${f}`, import.meta.url).href
