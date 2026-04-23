import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import AnalysisPage from './pages/AnalysisPage'
import ResultsPage from './pages/ResultsPage'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/analyze"
          element={<ProtectedRoute><AnalysisPage /></ProtectedRoute>}
        />
        <Route
          path="/results"
          element={<ProtectedRoute><ResultsPage /></ProtectedRoute>}
        />
        <Route path="/" element={<Navigate to="/analyze" replace />} />
        <Route path="*" element={<Navigate to="/analyze" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
