import { createContext, useContext, useState } from 'react'

const BookingContext = createContext(null)

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([
    { id: 'BK001', service: 'AC Repair', technician: 'Rajesh Kumar', date: '2025-04-10', time: '10:00 AM', status: 'confirmed', amount: 299 },
    { id: 'BK002', service: 'Plumbing', technician: 'Suresh Patel', date: '2025-04-08', time: '2:00 PM', status: 'completed', amount: 199 },
  ])

  const addBooking = (booking) => {
    const newBooking = { ...booking, id: `BK${String(bookings.length + 1).padStart(3, '0')}`, status: 'pending' }
    setBookings(prev => [newBooking, ...prev])
    return newBooking
  }

  const updateStatus = (id, status) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  return (
    <BookingContext.Provider value={{ bookings, addBooking, updateStatus }}>
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => useContext(BookingContext)
