/**
 * UserAvatar
 *
 * Reusable circular avatar showing the user's initial.
 * Used in Navbar, DashboardShell, ProfileTab, and anywhere
 * a user identity needs to be represented visually.
 *
 * Props:
 *   name      — user's display name (first letter is shown)
 *   size      — diameter in px (default: 36)
 *   bg        — background colour (default: var(--primary) blue)
 *   className — additional classes
 */
const UserAvatar = ({ name, size = 36, bg = '#2563eb', className = '' }) => (
  <div
    className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0 ${className}`}
    style={{ width: size, height: size, background: bg, fontSize: size * 0.38, lineHeight: 1 }}
    aria-hidden="true"
  >
    {name?.charAt(0).toUpperCase() || '?'}
  </div>
)

export default UserAvatar
