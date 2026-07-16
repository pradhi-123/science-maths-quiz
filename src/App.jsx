import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import PresenterPage from './pages/PresenterPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [route, setRoute] = useState('landing');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      if (hash.startsWith('#/presenter')) {
        setRoute('presenter');
      } else if (hash.startsWith('#/admin')) {
        setRoute('admin');
      } else {
        setRoute('landing');
      }
    };

    // Initialize routing on first load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (newRoute) => {
    window.location.hash = `#/${newRoute}`;
  };

  switch (route) {
    case 'presenter':
      return <PresenterPage navigateTo={navigateTo} />;
    case 'admin':
      return <AdminPage navigateTo={navigateTo} />;
    case 'landing':
    default:
      return <LandingPage navigateTo={navigateTo} />;
  }
}
