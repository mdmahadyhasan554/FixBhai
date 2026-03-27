import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HOME_CATEGORIES, ROUTES } from '../../constants'

/**
 * CategoryStrip
 * Horizontally scrollable category pill row.
 * Clicking a category navigates to /services filtered by that category.
 */
const CategoryStrip = () => {
  const [active, setActive] = useState('all')
  const navigate = useNavigate()

  const handleClick = (cat) => {
    setActive(cat.value)
    if (cat.value === 'all') navigate(ROUTES.SERVICES)
    else navigate(`${ROUTES.SERVICES}?category=${cat.value}`)
  }

  return (
    <section className="category-strip bg-white border-bottom" aria-label="Browse by category">
      <div className="container">
        <div className="category-scroll" role="list">
          {HOME_CATEGORIES.map(cat => (
            <button
              key={cat.value}
              role="listitem"
              type="button"
              className={`category-pill ${active === cat.value ? 'category-pill-active' : ''}`}
              onClick={() => handleClick(cat)}
              aria-pressed={active === cat.value}
            >
              <i className={`bi bi-${cat.icon}`} aria-hidden="true" />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryStrip
