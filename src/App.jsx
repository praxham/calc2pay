import { UPIProvider } from './contexts/UPIContext'
import Calculator from './components/Calculator.jsx'
function App() {
  return (
    <UPIProvider>
    <Calculator />
    </UPIProvider>
  )
}

export default App
