import { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CameraDetail from './pages/CameraDetail';
import AlertsLog from './pages/AlertsLog';
import Configuration from './pages/Configuration';
import Analytics from './pages/Analytics';
import About from './pages/About';
import { useCameraConfig } from './hooks/useCameraConfig';
import { useAlerts } from './hooks/useAlerts';
import { useAuthStore } from './store/authStore';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  // Initialize global hooks
  useCameraConfig();
  useAlerts();

  useEffect(() => {
     // Protect routes
     const publicRoutes = ['home', 'auth', 'about'];
     if (!user && !publicRoutes.includes(currentPage)) {
        setCurrentPage('auth');
     }
  }, [currentPage, user]);

  const navigateTo = (page: string, cameraId?: string) => {
    setCurrentPage(page);
    if (cameraId) setSelectedCamera(cameraId);
  };

  return (
    <Layout currentPage={currentPage} onNavigate={navigateTo}>
      {currentPage === 'home' && <Home onNavigate={(page) => navigateTo(page)} />}
      {currentPage === 'auth' && <Auth onLoginSuccess={() => navigateTo('dashboard')} />}
      {currentPage === 'dashboard' && user && <Dashboard onSelectCamera={(id) => navigateTo('camera', id)} />}
      {currentPage === 'camera' && selectedCamera && user && <CameraDetail cameraId={selectedCamera} />}
      {currentPage === 'alerts' && user && <AlertsLog />}
      {currentPage === 'configuration' && user && <Configuration />}
      {currentPage === 'analytics' && user && <Analytics />}
      {currentPage === 'about' && <About />}
    </Layout>
  );
}

export default App;
