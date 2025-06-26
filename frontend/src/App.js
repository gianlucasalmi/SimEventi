import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import StatistichePage from './pages/StatistichePage';
import { jwtDecode } from 'jwt-decode';
import MyEventsPage from './pages/MyEventsPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <Link className="navbar-brand" to="/">EVENTS FINDER</Link>
        <div className="collapse navbar-collapse">
          <div className="navbar-nav me-auto">
            {token && <Link className="nav-link" to="/dashboard">Dashboard</Link>}
            {token && jwtDecode(token).Ruolo === 'Dipendente' && (
              <Link className="nav-link" to="/mieventi">I miei eventi</Link>
            )}
            {token && jwtDecode(token).Ruolo === 'Organizzatore' && (
              <Link className="nav-link" to="/statistiche">Statistiche</Link>
            )}
          </div>
          {token && (
            <button
              className="btn btn-danger ms-auto"
              onClick={handleLogout}
              style={{ minWidth: 100 }}
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage onLogin={setToken} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={token ? <DashboardPage /> : <Navigate to="/login" />}
        />
        <Route path="/statistiche" element={token ? <StatistichePage /> : <Navigate to="/login" />} />
        <Route path="/mieventi" element={token ? <MyEventsPage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

