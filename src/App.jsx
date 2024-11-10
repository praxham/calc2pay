import { UPIProvider } from './contexts/UPIContext'
import Calculator from './components/calculator'
function App() {
  return (
    <UPIProvider>
    <Calculator />
    </UPIProvider>
  )
}

export default App
