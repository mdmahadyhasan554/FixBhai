// ── Routes ──────────────────────────────────────────────
export const ROUTES = {
  HOME: '/',
  SERVICES: '/services',
  TECHNICIANS: '/technicians',
  BOOKING: '/booking',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
}

// ── Booking status map ───────────────────────────────────
export const STATUS_MAP = {
  confirmed: { type: 'info',    label: 'Confirmed' },
  completed: { type: 'success', label: 'Completed' },
  pending:   { type: 'warning', label: 'Pending'   },
  cancelled: { type: 'danger',  label: 'Cancelled' },
}

// ── Time slots ───────────────────────────────────────────
export const TIME_SLOTS = [
  '9:00 AM','10:00 AM','11:00 AM','12:00 PM',
  '2:00 PM','3:00 PM','4:00 PM','5:00 PM',
]

// ── Service categories ───────────────────────────────────
export const SERVICE_CATEGORIES = [
  'All','appliance','plumbing','electrical',
  'cleaning','painting','carpentry','pest','security',
]

// ── Dashboard stat cards ─────────────────────────────────
export const STAT_CARDS = [
  { label: 'Total Bookings', icon: 'calendar-check', gradient: 'linear-gradient(135deg,#2563eb,#3b82f6)', key: 'total'     },
  { label: 'Completed',      icon: 'patch-check',    gradient: 'linear-gradient(135deg,#059669,#10b981)', key: 'completed' },
  { label: 'Pending',        icon: 'clock',          gradient: 'linear-gradient(135deg,#d97706,#f59e0b)', key: 'pending'   },
  { label: 'Total Spent',    icon: 'wallet2',         gradient: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', key: 'spent'    },
]

// ── Dashboard nav items ──────────────────────────────────
export const DASHBOARD_NAV = [
  { key: 'overview',  icon: 'grid',           label: 'Overview'     },
  { key: 'bookings',  icon: 'calendar-check', label: 'My Bookings'  },
  { key: 'profile',   icon: 'person-circle',  label: 'Profile'      },
]

// ── Homepage stats ───────────────────────────────────────
export const HOME_STATS = [
  { value: '50K+', label: 'Happy Customers',    icon: 'emoji-smile' },
  { value: '2K+',  label: 'Expert Technicians', icon: 'people'      },
  { value: '25+',  label: 'Services Offered',   icon: 'tools'       },
  { value: '4.8★', label: 'Average Rating',     icon: 'star'        },
]

// ── Navbar links ─────────────────────────────────────────
export const NAV_LINKS = [
  { to: '/',            label: 'Home'        },
  { to: '/services',    label: 'Services'    },
  { to: '/technicians', label: 'Technicians' },
  { to: '/booking',     label: 'Book Now'    },
]

// ── Footer config ─────────────────────────────────────────
export const FOOTER_SERVICES = ['AC Repair', 'Plumbing', 'Electrical', 'Cleaning', 'Painting']
export const FOOTER_COMPANY  = ['About Us', 'Careers', 'Blog', 'Press', 'Contact']
export const FOOTER_SOCIAL   = [
  { name: 'facebook',  href: '#' },
  { name: 'twitter',   href: '#' },
  { name: 'instagram', href: '#' },
  { name: 'linkedin',  href: '#' },
]
export const FOOTER_CONTACT = [
  { icon: 'telephone', text: '+91 98765 43210' },
  { icon: 'envelope',  text: 'support@fixbhai.in' },
  { icon: 'geo-alt',   text: 'Mumbai, Maharashtra, India' },
]

// ── Technician filter options ────────────────────────────
export const TECH_SERVICES = [
  'All', 'AC Repair', 'Plumbing', 'Electrical',
  'Cleaning', 'Carpentry', 'Painting', 'Pest Control', 'CCTV Install',
]

export const TECH_AVAILABILITY = [
  { value: 'all',       label: 'All Technicians'  },
  { value: 'available', label: 'Available Now'     },
  { value: 'busy',      label: 'Currently Busy'   },
]

export const TECH_SORT_OPTIONS = [
  { value: 'rating',     label: 'Top Rated'           },
  { value: 'price_asc',  label: 'Price: Low to High'  },
  { value: 'price_desc', label: 'Price: High to Low'  },
  { value: 'experience', label: 'Most Experienced'    },
  { value: 'reviews',    label: 'Most Reviewed'       },
]

// ── Booking form steps ───────────────────────────────────
export const BOOKING_STEPS = ['Service', 'Schedule', 'Confirm']

export const BOOKING_STATUS_FILTERS = [
  { value: 'all',       label: 'All'       },
  { value: 'pending',   label: 'Pending'   },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export const PROBLEM_CATEGORIES = [
  'Not working / broken',
  'Making noise',
  'Leaking / dripping',
  'Needs servicing / maintenance',
  'Installation required',
  'Inspection / checkup',
  'Other',
]

// ── How it works steps ───────────────────────────────────
export const HOW_IT_WORKS = [
  { step: 1, title: 'Choose a Service', desc: 'Browse from 25+ home services',      icon: 'grid'          },
  { step: 2, title: 'Book a Slot',      desc: 'Pick your preferred date and time',  icon: 'calendar-check'},
  { step: 3, title: 'Expert Arrives',   desc: 'Verified technician at your door',   icon: 'person-check'  },
  { step: 4, title: 'Job Done',         desc: 'Pay after the work is complete',     icon: 'patch-check'   },
]
