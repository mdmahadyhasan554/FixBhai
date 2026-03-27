import { Component } from 'react'

class ErrorBoundary extends Component {
  state = { hasError: false, message: '' }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unknown error' }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5 text-center">
          <i className="bi bi-exclamation-triangle text-danger fs-1 d-block mb-3" />
          <h4 className="fw-bold mb-2">Something went wrong</h4>
          <p className="text-muted mb-4">{this.state.message}</p>
          <button className="btn btn-primary rounded-pill px-4"
            onClick={() => this.setState({ hasError: false, message: '' })}>
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
