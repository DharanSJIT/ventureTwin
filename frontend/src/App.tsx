import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Career from './pages/Career';
import Startup from './pages/Startup';
import Learning from './pages/Learning';
import Settings from './pages/Settings';
import Resume from './pages/Resume';
import Placeholder from './pages/Placeholder';
import Skills from './pages/Skills';
import Certifications from './pages/Certifications';
import Achievements from './pages/Achievements';
import Insights from './pages/Insights';
import PortfolioBuilder from './pages/PortfolioBuilder';
import LivePortfolio from './pages/LivePortfolio';
import Login from './pages/auth/Login';
import AIAssistant from './components/AIAssistant';
import Register from './pages/auth/Register';
import Landing from './pages/Landing';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { Toaster } from 'sonner';

// Helper to redirect logged-in users away from auth/landing pages
function PublicRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        {/* Public Live Portfolio Route (Outside Dashboard) */}
        <Route path="/p/:username" element={<LivePortfolio />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/builder" element={<PortfolioBuilder />} />
          <Route path="/decisions" element={<Placeholder />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/opportunities" element={<Placeholder />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/timeline" element={<Placeholder />} />
          <Route path="/applications" element={<Placeholder />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/analytics" element={<Placeholder />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Legacy links that might still be active in some places */}
          <Route path="/career" element={<Career />} />
          <Route path="/startup" element={<Startup />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AIAssistant />
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
