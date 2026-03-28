// ── Routes ──────────────────────────────────────────────
export const ROUTES = {
  HOME:        '/',
  SERVICES:    '/services',
  TECHNICIANS: '/technicians',
  BOOKING:     '/booking',
  LOGIN:       '/login',
  REGISTER:    '/register',
  DASHBOARD:   '/dashboard',
  // Role-specific dashboards (future)
  ADMIN:       '/admin',
  TECH_PORTAL: '/technician',
  // Catch-all
  NOT_FOUND:   '*',
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

// ── Customer dashboard nav ───────────────────────────────
export const DASHBOARD_NAV = [
  { key: 'overview',  icon: 'grid',           label: 'Overview'     },
  { key: 'bookings',  icon: 'calendar-check', label: 'My Bookings'  },
  { key: 'profile',   icon: 'person-circle',  label: 'Profile'      },
]

// ── Admin dashboard nav ──────────────────────────────────
export const ADMIN_NAV = [
  { key: 'overview',     icon: 'grid',           label: 'Overview'      },
  { key: 'bookings',     icon: 'calendar-check', label: 'All Bookings'  },
  { key: 'users',        icon: 'people',         label: 'Users'         },
  { key: 'technicians',  icon: 'person-badge',   label: 'Technicians'   },
  { key: 'services',     icon: 'tools',          label: 'Services'      },
  { key: 'analytics',    icon: 'bar-chart',      label: 'Analytics'     },
]

// ── Technician dashboard nav ─────────────────────────────
export const TECH_NAV = [
  { key: 'overview',     icon: 'grid',           label: 'Overview'      },
  { key: 'jobs',         icon: 'briefcase',      label: 'My Jobs'       },
  { key: 'schedule',     icon: 'calendar3',      label: 'Schedule'      },
  { key: 'earnings',     icon: 'wallet2',        label: 'Earnings'      },
  { key: 'profile',      icon: 'person-circle',  label: 'Profile'       },
]

// ── Admin stat cards ─────────────────────────────────────
export const ADMIN_STAT_CARDS = [
  { label: 'Total Revenue',    icon: 'currency-rupee', gradient: 'linear-gradient(135deg,#2563eb,#3b82f6)', key: 'revenue'     },
  { label: 'Total Bookings',   icon: 'calendar-check', gradient: 'linear-gradient(135deg,#059669,#10b981)', key: 'bookings'    },
  { label: 'Active Users',     icon: 'people-fill',    gradient: 'linear-gradient(135deg,#d97706,#f59e0b)', key: 'users'       },
  { label: 'Technicians',      icon: 'person-badge',   gradient: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', key: 'technicians' },
]

// ── Technician stat cards ────────────────────────────────
export const TECH_STAT_CARDS = [
  { label: 'Jobs Today',       icon: 'calendar-day',   gradient: 'linear-gradient(135deg,#2563eb,#3b82f6)', key: 'today'       },
  { label: 'Completed',        icon: 'patch-check',    gradient: 'linear-gradient(135deg,#059669,#10b981)', key: 'completed'   },
  { label: 'This Month',       icon: 'calendar-month', gradient: 'linear-gradient(135deg,#d97706,#f59e0b)', key: 'month'       },
  { label: 'Total Earnings',   icon: 'wallet2',        gradient: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', key: 'earnings'    },
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
  { icon: 'telephone', text: '01909045166' },
  { icon: 'envelope',  text: 'support@fixbhai.com' },
  { icon: 'geo-alt',   text: 'Savar, Dhaka, Bangladesh' },
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

// ── Homepage category pills ──────────────────────────────
export const HOME_CATEGORIES = [
  { label: 'All',         icon: 'grid-fill',        value: 'all'       },
  { label: 'AC & Cooling',icon: 'wind',             value: 'appliance' },
  { label: 'Plumbing',    icon: 'droplet-fill',     value: 'plumbing'  },
  { label: 'Electrical',  icon: 'lightning-charge-fill', value: 'electrical'},
  { label: 'Cleaning',    icon: 'stars',            value: 'cleaning'  },
  { label: 'Painting',    icon: 'brush-fill',       value: 'painting'  },
  { label: 'Carpentry',   icon: 'hammer',           value: 'carpentry' },
  { label: 'Pest Control',icon: 'bug-fill',         value: 'pest'      },
  { label: 'Security',    icon: 'camera-video-fill',value: 'security'  },
]

// ── Testimonials ─────────────────────────────────────────
export const TESTIMONIALS = [
  { id: 1, name: 'Priya Mehta',   location: 'Andheri, Mumbai', rating: 5, avatar: 'https://i.pravatar.cc/80?img=47', service: 'AC Repair',  text: 'Rajesh arrived on time and fixed my AC in under an hour. Super professional and reasonably priced. Will definitely book again!' },
  { id: 2, name: 'Arjun Sharma',  location: 'Bandra, Mumbai',  rating: 5, avatar: 'https://i.pravatar.cc/80?img=68', service: 'Plumbing',   text: 'Had a major pipe leak at midnight. FixBhai connected me with a plumber within 30 minutes. Lifesaver!' },
  { id: 3, name: 'Sneha Kapoor',  location: 'Powai, Mumbai',   rating: 4, avatar: 'https://i.pravatar.cc/80?img=49', service: 'Cleaning',   text: 'The deep cleaning team was thorough and left my apartment spotless. Great value for money.' },
]

// ── Trust badges ─────────────────────────────────────────
export const TRUST_BADGES = [
  { icon: 'patch-check-fill', label: 'Verified Technicians', desc: 'Background checked & certified' },
  { icon: 'shield-fill-check',label: 'Insured Work',         desc: 'All services are fully insured'  },
  { icon: 'clock-fill',       label: 'On-Time Guarantee',    desc: 'We respect your time'            },
  { icon: 'cash-coin',        label: 'Pay After Service',    desc: 'No upfront payment required'     },
]

// ── Service colour map (used by BookingCard, HeroSection, AdminOverviewTab) ──
export const SERVICE_COLOURS = {
  'AC Repair':    { bg: '#dbeafe', color: '#2563eb', icon: 'wind'             },
  'Plumbing':     { bg: '#d1fae5', color: '#059669', icon: 'droplet'          },
  'Electrical':   { bg: '#fef3c7', color: '#d97706', icon: 'lightning-charge' },
  'Cleaning':     { bg: '#ede9fe', color: '#7c3aed', icon: 'stars'            },
  'Painting':     { bg: '#fce7f3', color: '#db2777', icon: 'brush'            },
  'Carpentry':    { bg: '#ffedd5', color: '#ea580c', icon: 'hammer'           },
  'Pest Control': { bg: '#dcfce7', color: '#16a34a', icon: 'bug'              },
  'CCTV Install': { bg: '#e0f2fe', color: '#0284c7', icon: 'camera-video'     },
}

// ── How it works steps ───────────────────────────────────
export const HOW_IT_WORKS = [
  { step: 1, title: 'Choose a Service', desc: 'Browse from 25+ home services',      icon: 'grid'          },
  { step: 2, title: 'Book a Slot',      desc: 'Pick your preferred date and time',  icon: 'calendar-check'},
  { step: 3, title: 'Expert Arrives',   desc: 'Verified technician at your door',   icon: 'person-check'  },
  { step: 4, title: 'Job Done',         desc: 'Pay after the work is complete',     icon: 'patch-check'   },
]
