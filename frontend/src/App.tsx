import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Career from './pages/Career';
import Startup from './pages/Startup';
import Learning from './pages/Learning';
import Settings from './pages/Settings';
import Placeholder from './pages/Placeholder';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Landing from './pages/Landing';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';

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
        
        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/decisions" element={<Placeholder />} />
          <Route path="/skills" element={<Placeholder />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/opportunities" element={<Placeholder />} />
          <Route path="/insights" element={<Placeholder />} />
          <Route path="/timeline" element={<Placeholder />} />
          <Route path="/certifications" element={<Placeholder />} />
          <Route path="/applications" element={<Placeholder />} />
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
    </Router>
  );
}

export default App;
