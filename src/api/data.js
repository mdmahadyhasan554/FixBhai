// ── Services — prices in BDT (Bangladeshi Taka) ──────────
export const SERVICES = [
  { id: 1, name: 'AC Repair',    icon: 'wind',             color: '#dbeafe', iconColor: '#2563eb', price: 800,  category: 'appliance',  rating: 4.8, bookings: 1240 },
  { id: 2, name: 'Plumbing',     icon: 'droplet',          color: '#d1fae5', iconColor: '#059669', price: 400,  category: 'plumbing',   rating: 4.7, bookings: 980  },
  { id: 3, name: 'Electrical',   icon: 'lightning-charge', color: '#fef3c7', iconColor: '#d97706', price: 300,  category: 'electrical', rating: 4.9, bookings: 1560 },
  { id: 4, name: 'Cleaning',     icon: 'stars',            color: '#ede9fe', iconColor: '#7c3aed', price: 600,  category: 'cleaning',   rating: 4.6, bookings: 2100 },
  { id: 5, name: 'Painting',     icon: 'brush',            color: '#fce7f3', iconColor: '#db2777', price: 1200, category: 'painting',   rating: 4.5, bookings: 760  },
  { id: 6, name: 'Carpentry',    icon: 'hammer',           color: '#ffedd5', iconColor: '#ea580c', price: 500,  category: 'carpentry',  rating: 4.7, bookings: 540  },
  { id: 7, name: 'Pest Control', icon: 'bug',              color: '#dcfce7', iconColor: '#16a34a', price: 700,  category: 'pest',       rating: 4.8, bookings: 890  },
  { id: 8, name: 'CCTV Install', icon: 'camera-video',     color: '#e0f2fe', iconColor: '#0284c7', price: 1500, category: 'security',   rating: 4.9, bookings: 430  },
]

// ── Technicians — Bangladeshi names, phones & locations ──
export const TECHNICIANS = [
  { id: 1, name: 'Karim Sheikh',   service: 'AC Repair',    rating: 4.9, reviews: 234, experience: '8 yrs',  location: 'Mirpur, Dhaka',              phone: '01898765432', available: true,  price: 800,  avatar: 'https://i.pravatar.cc/150?img=11', verified: true  },
  { id: 2, name: 'Rahim Mia',      service: 'Plumbing',     rating: 4.7, reviews: 189, experience: '6 yrs',  location: 'Dhanmondi, Dhaka',           phone: '01712345678', available: true,  price: 400,  avatar: 'https://i.pravatar.cc/150?img=12', verified: true  },
  { id: 3, name: 'Jamal Hossain',  service: 'Electrical',   rating: 4.8, reviews: 312, experience: '10 yrs', location: 'Agrabad, Chittagong',        phone: '01611223344', available: false, price: 300,  avatar: 'https://i.pravatar.cc/150?img=13', verified: true  },
  { id: 4, name: 'Nasrin Begum',   service: 'Cleaning',     rating: 4.6, reviews: 156, experience: '4 yrs',  location: 'Gulshan, Dhaka',             phone: '01755667788', available: true,  price: 600,  avatar: 'https://i.pravatar.cc/150?img=5',  verified: true  },
  { id: 5, name: 'Sohel Rana',     service: 'Carpentry',    rating: 4.9, reviews: 98,  experience: '12 yrs', location: 'Zindabazar, Sylhet',         phone: '01833445566', available: true,  price: 500,  avatar: 'https://i.pravatar.cc/150?img=15', verified: false },
  { id: 6, name: 'Farida Khanam',  service: 'Painting',     rating: 4.5, reviews: 67,  experience: '3 yrs',  location: 'Boyra, Khulna',              phone: '01977889900', available: true,  price: 1200, avatar: 'https://i.pravatar.cc/150?img=9',  verified: true  },
  { id: 7, name: 'Rafiq Islam',    service: 'Pest Control', rating: 4.7, reviews: 112, experience: '5 yrs',  location: 'Rajshahi Sadar',             phone: '01521234567', available: true,  price: 700,  avatar: 'https://i.pravatar.cc/150?img=20', verified: true  },
  { id: 8, name: 'Sumaiya Akter',  service: 'CCTV Install', rating: 4.8, reviews: 45,  experience: '4 yrs',  location: 'Sadar, Barisal',             phone: '01688990011', available: true,  price: 1500, avatar: 'https://i.pravatar.cc/150?img=25', verified: true  },
]

// ── Seed bookings — BDT amounts + BD addresses ───────────
export const BOOKINGS = [
  { id: 'BK001', service: 'AC Repair',  technician: 'Karim Sheikh',  date: '2025-04-10', time: '10:00 AM', status: 'confirmed', amount: 800,  address: 'House 12, Road 5, Dhanmondi, Dhaka' },
  { id: 'BK002', service: 'Plumbing',   technician: 'Rahim Mia',     date: '2025-04-08', time: '2:00 PM',  status: 'completed', amount: 400,  address: 'Flat 4B, Block C, Bashundhara R/A, Dhaka' },
  { id: 'BK003', service: 'Electrical', technician: 'Jamal Hossain', date: '2025-04-12', time: '11:00 AM', status: 'pending',   amount: 300,  address: '23 Agrabad Commercial Area, Chittagong' },
]
