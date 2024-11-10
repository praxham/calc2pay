import { createContext, useContext, useState, useEffect } from 'react'

const UPIContext = createContext()

// Key for localStorage
const UPI_STORAGE_KEY = 'upi_id'

export function UPIProvider({ children }) {
  // Initialize state from localStorage or empty string
  const [upiId, setUpiId] = useState(() => {
    const savedUpiId = localStorage.getItem(UPI_STORAGE_KEY)
    return savedUpiId || ''
  })

  // Update localStorage whenever upiId changes
  useEffect(() => {
    if (upiId) {
      localStorage.setItem(UPI_STORAGE_KEY, upiId)
    } else {
      localStorage.removeItem(UPI_STORAGE_KEY)
    }
  }, [upiId])

  const updateUPI = (newId) => {
    setUpiId(newId)
  }

  const value = {
    upiId,
    updateUPI,
  }

  return (
    <UPIContext.Provider value={value}>
      {children}
    </UPIContext.Provider>
  )
}

// Custom hook to use UPI context
export function useUPI() {
  const context = useContext(UPIContext)
  if (context === undefined) {
    throw new Error('useUPI must be used within a UPIProvider')
  }
  return context
}