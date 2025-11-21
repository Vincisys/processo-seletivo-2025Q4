import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OwnerList from './pages/OwnerList';
import OwnerForm from './pages/OwnerForm';
import OwnerDetails from './pages/OwnerDetails';
import AssetList from './pages/AssetList';
import AssetForm from './pages/AssetForm';
import AssetDetails from './pages/AssetDetails';
import './App.css';

function AppContent() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="app">
      {isAuthenticated && (
        <nav className="navbar">
          <div className="container">
            <Link to="/" className="navbar-brand">
              <span className="logo">👁️</span>
              EyesOnAsset
            </Link>
            <div className="navbar-links">
              <Link to="/owners" className="nav-link">
                Responsáveis
              </Link>
              <Link to="/assets" className="nav-link">
                Ativos
              </Link>
              <div className="nav-user">
                <span className="user-name">👤 {user?.name}</span>
                <button onClick={logout} className="btn btn-sm btn-danger">
                  Sair
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className="main-content">
        <Routes>
          {/* Rotas públicas */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
          />

          {/* Rotas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owners"
            element={
              <ProtectedRoute>
                <OwnerList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owners/new"
            element={
              <ProtectedRoute>
                <OwnerForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owners/edit/:id"
            element={
              <ProtectedRoute>
                <OwnerForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owners/:id"
            element={
              <ProtectedRoute>
                <OwnerDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assets"
            element={
              <ProtectedRoute>
                <AssetList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assets/new"
            element={
              <ProtectedRoute>
                <AssetForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assets/edit/:id"
            element={
              <ProtectedRoute>
                <AssetForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assets/:id"
            element={
              <ProtectedRoute>
                <AssetDetails />
              </ProtectedRoute>
            }
          />

          {/* Rota catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {isAuthenticated && (
        <footer className="footer">
          <div className="container">
            <p className="text-center text-muted text-sm">
              © 2025 EyesOnAsset - Sistema de Gestão de Ativos
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
