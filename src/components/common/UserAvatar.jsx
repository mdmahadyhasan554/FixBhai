/**
 * UserAvatar
 *
 * Reusable circular avatar showing the user's profile picture or initials.
 * Used in Navbar, DashboardShell, ProfileTab, and anywhere
 * a user identity needs to be represented visually.
 *
 * Props:
 *   name      — user's display name (used for initials fallback)
 *   avatarUrl — user's profile picture URL (optional)
 *   size      — diameter in px (default: 36)
 *   bg        — background colour for initials (default: var(--primary) blue)
 *   className — additional classes
 */
const UserAvatar = ({ name, avatarUrl, size = 36, bg = '#2563eb', className = '' }) => {
  const getInitials = () => {
    if (!name) return '?'
    const names = name.split(' ')
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <div
      className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0 overflow-hidden ${className}`}
      style={{ 
        width: size, 
        height: size, 
        background: avatarUrl ? '#f8f9fa' : bg, 
        fontSize: size * 0.38, 
        lineHeight: 1 
      }}
      aria-hidden="true"
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        getInitials()
      )}
    </div>
  )
}

export default UserAvatar
