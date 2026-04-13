/**
 * mock.js — In-memory mock responses
 *
 * Used when VITE_USE_MOCK=true (default while backend is not ready).
 * Each function mirrors the real API contract so swapping is a one-line change.
 *
 * Usage in API modules:
 *   if (USE_MOCK) return mock.someMethod(args)
 */
import { SERVICES, TECHNICIANS, BOOKINGS } from './data'
import { generateBookingId } from '../utils/formatters'

const delay = (ms = 600) => new Promise(r => setTimeout(r, ms))

// In-memory booking store (persists for the session)
let _bookings = [...BOOKINGS]

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const mock = {
  // ── Auth ────────────────────────────────────────────────
  async login({ email, password }) {
    await delay(800)
    if (!email) throw new Error('Email is required')
    if (!password) throw new Error('Password is required')
    
    // Mock role assignment based on email
    let role = 'customer'
    const emailLower = email.toLowerCase()
    
    if (emailLower === 'admin@fixbhai.com') {
      role = 'admin'
    } else if (emailLower === 'karim@fixbhai.com' || emailLower.includes('tech')) {
      role = 'technician'
    }
    
    const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    return {
      user: { name, email, role },
      // Note: Real backend uses session cookies, no token needed
    }
  },

  async register({ name, email, phone, password }) {
    await delay(800)
    if (!name || !email || !password) throw new Error('All fields are required')
    return {
      user: { name, email, phone, role: 'customer' },
      // Note: Real backend uses session cookies, no token needed
    }
  },

  async getProfile() {
    await delay(300)
    const raw = localStorage.getItem('fixbhai_user')
    if (!raw) throw new Error('Not authenticated')
    return JSON.parse(raw)
  },

  // ── Services ────────────────────────────────────────────
  async getServices(params = {}) {
    await delay(400)
    let list = [...SERVICES]
    if (params.category && params.category !== 'All')
      list = list.filter(s => s.category === params.category)
    if (params.q)
      list = list.filter(s => s.name.toLowerCase().includes(params.q.toLowerCase()))
    return { data: list, total: list.length }
  },

  async getServiceById(id) {
    await delay(300)
    const svc = SERVICES.find(s => s.id === Number(id))
    if (!svc) throw new Error('Service not found')
    return svc
  },

  // ── Technicians ─────────────────────────────────────────
  async getTechnicians(params = {}) {
    await delay(500)
    let list = [...TECHNICIANS]
    if (params.service && params.service !== 'All')
      list = list.filter(t => t.service === params.service)
    if (params.available === 'available')
      list = list.filter(t => t.available)
    if (params.maxPrice)
      list = list.filter(t => t.price <= Number(params.maxPrice))
    if (params.q)
      list = list.filter(t =>
        t.name.toLowerCase().includes(params.q.toLowerCase()) ||
        t.service.toLowerCase().includes(params.q.toLowerCase()) ||
        t.location.toLowerCase().includes(params.q.toLowerCase())
      )
    return { data: list, total: list.length }
  },

  async getTechnicianById(id) {
    await delay(300)
    const tech = TECHNICIANS.find(t => t.id === Number(id))
    if (!tech) throw new Error('Technician not found')
    return tech
  },

  // ── Bookings ────────────────────────────────────────────
  async getBookings() {
    await delay(400)
    return { data: _bookings, total: _bookings.length }
  },

  async getBookingById(id) {
    await delay(300)
    const booking = _bookings.find(b => b.id === id)
    if (!booking) throw new Error('Booking not found')
    return booking
  },

  async createBooking(payload) {
    await delay(1000)
    const svc  = SERVICES.find(s => s.name === payload.service)
    const tech = TECHNICIANS.find(t => String(t.id) === String(payload.techId))
    const newBooking = {
      ...payload,
      id:         generateBookingId(_bookings.length),
      status:     'pending',
      amount:     svc?.price || 299,
      technician: tech?.name || 'Auto Assigned',
      createdAt:  new Date().toISOString(),
    }
    _bookings = [newBooking, ..._bookings]
    return newBooking
  },

  async updateBookingStatus(id, status) {
    await delay(400)
    const idx = _bookings.findIndex(b => b.id === id)
    if (idx === -1) throw new Error('Booking not found')
    _bookings[idx] = { ..._bookings[idx], status }
    return _bookings[idx]
  },

  async cancelBooking(id) {
    return mock.updateBookingStatus(id, 'cancelled')
  },
}

export default mock
