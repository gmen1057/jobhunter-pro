import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import Login from './pages/Login';
import { Settings } from './pages/Settings';
import { VacancySearch } from './pages/VacancySearch';
import { Analytics } from './pages/Analytics';
import { Resumes } from './pages/Resumes';
import { Navigation } from './components/Navigation';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    // Проверяем авторизацию при загрузке
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
  }, []);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/search" element={<VacancySearch />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/resumes" element={<Resumes />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;