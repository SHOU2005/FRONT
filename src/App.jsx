import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AnalysisPage from './pages/AnalysisPage';
import ResultsPage from './pages/ResultsPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';


// Logout component to clear session and redirect
function Logout() {
  const { logout } = useAuth();
  useEffect(() => {
    logout();
  }, [logout]);
  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      {/* Public route - Login page */}
      <Route path="/login" element={<LoginPage />} />

      {/* Logout route */}
      <Route path="/logout" element={<Logout />} />

      {/* Protected routes - Access for Admin and Analyst */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'ANALYST']}>
            <LandingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analyze"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'ANALYST']}>
            <AnalysisPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/results"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'ANALYST']}>
            <ResultsPage />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home (which will redirect to login if needed) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
