export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

// Format date
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date))
}

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + '...'
}

// Generate random color
export const generateRandomColor = () => {
  const colors = [
    'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
    'linear-gradient(45deg, #667eea, #764ba2)',
    'linear-gradient(45deg, #f093fb, #f5576c)',
    'linear-gradient(45deg, #4facfe, #00f2fe)',
    'linear-gradient(45deg, #43e97b, #38f9d7)',
    'linear-gradient(45deg, #fa709a, #fee140)'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Check if image is loaded
export const isImageLoaded = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => reject(false)
    img.src = src
  })
}