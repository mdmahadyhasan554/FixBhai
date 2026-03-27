import { TESTIMONIALS } from '../../constants'

/**
 * TestimonialsSection
 * 3-column customer review cards.
 */
const TestimonialsSection = () => (
  <section className="py-5 bg-white" aria-label="Customer testimonials">
    <div className="container">
      <div className="text-center mb-5">
        <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 mb-3 d-inline-block">
          Customer Stories
        </span>
        <h2 className="section-title mb-2">What Our Customers Say</h2>
        <p className="section-sub">Real reviews from real people</p>
      </div>

      <div className="row g-4">
        {TESTIMONIALS.map(t => (
          <div key={t.id} className="col-md-4">
            <div className="testimonial-card h-100">
              {/* Stars */}
              <div className="d-flex gap-1 mb-3" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <i key={i}
                    className={`bi bi-star${i < t.rating ? '-fill' : ''} text-warning`}
                    style={{ fontSize: '0.85rem' }}
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="mb-4" style={{ color: '#475569', lineHeight: 1.7 }}>
                "{t.text}"
              </p>

              {/* Author */}
              <div className="d-flex align-items-center gap-3 mt-auto">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="rounded-circle flex-shrink-0"
                  width={44} height={44}
                  style={{ objectFit: 'cover', border: '2px solid #dbeafe' }}
                />
                <div>
                  <div className="fw-semibold small">{t.name}</div>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                    <i className="bi bi-geo-alt me-1" aria-hidden="true" />{t.location}
                  </div>
                </div>
                <span className="ms-auto badge bg-primary bg-opacity-10 text-primary rounded-pill small">
                  {t.service}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default TestimonialsSection
