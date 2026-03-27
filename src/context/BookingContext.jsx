import { createContext, useContext, useState } from 'react'
import { generateBookingId } from '../utils/formatters'

const BookingContext = createContext(null)

const SEED_BOOKINGS = [
  { id: 'BK001', service: 'AC Repair',  technician: 'Rajesh Kumar', date: '2025-04-10', time: '10:00 AM', status: 'confirmed', amount: 299 },
  { id: 'BK002', service: 'Plumbing',   technician: 'Suresh Patel', date: '2025-04-08', time: '2:00 PM',  status: 'completed', amount: 199 },
]

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState(SEED_BOOKINGS)

  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: generateBookingId(bookings.length),
      status: 'pending',
    }
    setBookings(prev => [newBooking, ...prev])
    return newBooking
  }

  const updateStatus = (id, status) =>
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))

  const getStats = () => ({
    total:     bookings.length,
    completed: bookings.filter(b => b.status === 'completed').length,
    pending:   bookings.filter(b => b.status === 'pending').length,
    spent:     `₹${bookings.filter(b => b.status === 'completed').reduce((s, b) => s + b.amount, 0)}`,
  })

  return (
    <BookingContext.Provider value={{ bookings, addBooking, updateStatus, getStats }}>
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider')
  return ctx
}
