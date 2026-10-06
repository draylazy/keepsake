import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './state/AppContext';
import { setStorageService } from './services/storage';
import { firestoreService, isFirebaseConfigured } from './services/firestore';
import { localService } from './services/local';

import Landing from './pages/Landing';
import Pick from './pages/Pick';
import StyleSelector from './pages/Style';
import Share from './pages/Share';
import Viewer from './pages/Viewer';

import ThemeToggle from './components/ThemeToggle';

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Choose storage implementation based on whether Firebase keys are set
    if (isFirebaseConfigured) {
      setStorageService(firestoreService);
    } else {
      setStorageService(localService);
    }
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  return (
    <AppProvider>
      <ThemeToggle />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pick" element={<Pick />} />
          <Route path="/style" element={<StyleSelector />} />
          <Route path="/share" element={<Share />} />
          <Route path="/a/:code" element={<Viewer />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
