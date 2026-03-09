import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'

// Public Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// NGO Pages
import NGODashboard from './pages/ngo/NGODashboard'
import NGOProfile from './pages/ngo/NGOProfile'
import ReceiptsPage from './pages/ngo/ReceiptsPage'
import CompliancePage from './pages/ngo/CompliancePage'
import VoiceInputPage from './pages/ngo/VoiceInputPage'
import ProjectsPage from './pages/ngo/ProjectsPage'

// CSR Pages
import CSRDashboard from './pages/csr/CSRDashboard'
import SearchPage from './pages/csr/SearchPage'
import NGODetailPage from './pages/csr/NGODetailPage'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              background: '#0f172a',
              color: '#fff',
              fontSize: '14px',
            },
          }}
        />
        <Routes>
          {/* ========== Public Routes ========== */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ========== NGO Routes ========== */}
          <Route path="/ngo/dashboard" element={<NGODashboard />} />
          <Route path="/ngo/profile" element={<NGOProfile />} />
          <Route path="/ngo/receipts" element={<ReceiptsPage />} />
          <Route path="/ngo/compliance" element={<CompliancePage />} />
          <Route path="/ngo/voice" element={<VoiceInputPage />} />
          <Route path="/ngo/projects" element={<ProjectsPage />} />

          {/* ========== CSR Investor Routes ========== */}
          <Route path="/csr/dashboard" element={<CSRDashboard />} />
          <Route path="/csr/search" element={<SearchPage />} />
          <Route path="/csr/ngo/:id" element={<NGODetailPage />} />

          {/* ========== 404 Fallback ========== */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-surface">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
                <p className="text-xl text-text-secondary mb-6">Page not found</p>
                <a href="/" className="text-primary font-semibold hover:underline">Go Home</a>
              </div>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}