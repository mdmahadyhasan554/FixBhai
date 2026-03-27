export const SERVICES = [
  { id: 1, name: 'AC Repair', icon: 'wind', color: '#dbeafe', iconColor: '#2563eb', price: 299, category: 'appliance', rating: 4.8, bookings: 1240 },
  { id: 2, name: 'Plumbing', icon: 'droplet', color: '#d1fae5', iconColor: '#059669', price: 199, category: 'plumbing', rating: 4.7, bookings: 980 },
  { id: 3, name: 'Electrical', icon: 'lightning-charge', color: '#fef3c7', iconColor: '#d97706', price: 249, category: 'electrical', rating: 4.9, bookings: 1560 },
  { id: 4, name: 'Cleaning', icon: 'stars', color: '#ede9fe', iconColor: '#7c3aed', price: 399, category: 'cleaning', rating: 4.6, bookings: 2100 },
  { id: 5, name: 'Painting', icon: 'brush', color: '#fce7f3', iconColor: '#db2777', price: 599, category: 'painting', rating: 4.5, bookings: 760 },
  { id: 6, name: 'Carpentry', icon: 'hammer', color: '#ffedd5', iconColor: '#ea580c', price: 349, category: 'carpentry', rating: 4.7, bookings: 540 },
  { id: 7, name: 'Pest Control', icon: 'bug', color: '#dcfce7', iconColor: '#16a34a', price: 499, category: 'pest', rating: 4.8, bookings: 890 },
  { id: 8, name: 'CCTV Install', icon: 'camera-video', color: '#e0f2fe', iconColor: '#0284c7', price: 799, category: 'security', rating: 4.9, bookings: 430 },
]

export const TECHNICIANS = [
  { id: 1, name: 'Rajesh Kumar', service: 'AC Repair', rating: 4.9, reviews: 234, experience: '8 yrs', location: 'Andheri, Mumbai', available: true, price: 299, avatar: 'https://i.pravatar.cc/150?img=11', verified: true },
  { id: 2, name: 'Suresh Patel', service: 'Plumbing', rating: 4.7, reviews: 189, experience: '6 yrs', location: 'Bandra, Mumbai', available: true, price: 199, avatar: 'https://i.pravatar.cc/150?img=12', verified: true },
  { id: 3, name: 'Amit Singh', service: 'Electrical', rating: 4.8, reviews: 312, experience: '10 yrs', location: 'Powai, Mumbai', available: false, price: 249, avatar: 'https://i.pravatar.cc/150?img=13', verified: true },
  { id: 4, name: 'Priya Sharma', service: 'Cleaning', rating: 4.6, reviews: 156, experience: '4 yrs', location: 'Juhu, Mumbai', available: true, price: 399, avatar: 'https://i.pravatar.cc/150?img=5', verified: true },
  { id: 5, name: 'Vikram Rao', service: 'Carpentry', rating: 4.9, reviews: 98, experience: '12 yrs', location: 'Dadar, Mumbai', available: true, price: 349, avatar: 'https://i.pravatar.cc/150?img=15', verified: false },
  { id: 6, name: 'Neha Gupta', service: 'Painting', rating: 4.5, reviews: 67, experience: '3 yrs', location: 'Malad, Mumbai', available: true, price: 599, avatar: 'https://i.pravatar.cc/150?img=9', verified: true },
]

export const BOOKINGS = [
  { id: 'BK001', service: 'AC Repair', technician: 'Rajesh Kumar', date: '2025-04-10', time: '10:00 AM', status: 'confirmed', amount: 299 },
  { id: 'BK002', service: 'Plumbing', technician: 'Suresh Patel', date: '2025-04-08', time: '2:00 PM', status: 'completed', amount: 199 },
  { id: 'BK003', service: 'Electrical', technician: 'Amit Singh', date: '2025-04-12', time: '11:00 AM', status: 'pending', amount: 249 },
]
