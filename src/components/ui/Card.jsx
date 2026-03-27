/**
 * Card family — Card, Card.Header, Card.Body, Card.Footer, Card.Image
 *
 * Card props:
 *   hoverable  — adds lift-on-hover transition
 *   bordered   — shows a subtle border (default: shadow only)
 *   padding    — 'none' | 'sm' | 'md' (default) | 'lg'
 *   rounded    — 'sm' | 'md' (default) | 'lg' | 'xl'
 *   className  — additional classes
 *
 * Usage:
 *   <Card hoverable>
 *     <Card.Header>Title</Card.Header>
 *     <Card.Body>Content</Card.Body>
 *     <Card.Footer>Actions</Card.Footer>
 *   </Card>
 */

const PADDING_MAP = { none: 'p-0', sm: 'p-2', md: 'p-3', lg: 'p-4' }
const RADIUS_MAP  = { sm: 'rounded-2', md: 'rounded-3', lg: 'rounded-4', xl: 'rounded-5' }

const Card = ({
  children,
  hoverable = false,
  bordered  = false,
  padding   = 'md',
  rounded   = 'lg',
  className = '',
  style     = {},
  ...props
}) => {
  const classes = [
    'card',
    bordered ? 'border' : 'border-0',
    'shadow-sm',
    RADIUS_MAP[rounded] || 'rounded-4',
    hoverable ? 'card-hoverable' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={classes} style={style} {...props}>
      {children}
    </div>
  )
}

Card.Header = function CardHeader({ children, className = '' }) {
  return (
    <div className={`card-header bg-white border-bottom fw-semibold py-3 px-4 ${className}`}>
      {children}
    </div>
  )
}

Card.Body = function CardBody({ children, className = '' }) {
  return (
    <div className={`card-body ${className}`}>
      {children}
    </div>
  )
}

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={`card-footer bg-white border-top py-3 px-4 ${className}`}>
      {children}
    </div>
  )
}

Card.Image = function CardImage({ src, alt = '', position = 'top', height = 200 }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`card-img-${position}`}
      style={{ objectFit: 'cover', height }}
    />
  )
}

export default Card
