import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AnalysisPage from './pages/AnalysisPage'
import ResultsPage from './pages/ResultsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/analyze" element={<AnalysisPage />} />
      <Route path="/results" element={<ResultsPage />} />
    </Routes>
  )
}

export default App
