import { useState } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import CameraDetail from './pages/CameraDetail';
import AlertsLog from './pages/AlertsLog';
import Configuration from './pages/Configuration';
import Analytics from './pages/Analytics';
import About from './pages/About';
import { useCameraConfig } from './hooks/useCameraConfig';
import { useAlerts } from './hooks/useAlerts';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);

  // Initialize global hooks
  useCameraConfig();
  useAlerts();

  const navigateTo = (page: string, cameraId?: string) => {
    setCurrentPage(page);
    if (cameraId) setSelectedCamera(cameraId);
  };

  return (
    <Layout currentPage={currentPage} onNavigate={navigateTo}>
      {currentPage === 'dashboard' && <Dashboard onSelectCamera={(id) => navigateTo('camera', id)} />}
      {currentPage === 'camera' && selectedCamera && <CameraDetail cameraId={selectedCamera} />}
      {currentPage === 'alerts' && <AlertsLog />}
      {currentPage === 'configuration' && <Configuration />}
      {currentPage === 'analytics' && <Analytics />}
      {currentPage === 'about' && <About />}
    </Layout>
  );
}

export default App;
