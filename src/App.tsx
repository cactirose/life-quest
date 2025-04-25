
import { useEffect, useState } from 'react';
import { Routes } from './Routes';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { DataProvider } from '@/contexts/DataContext';

const App = () => {
  const [mounted, setMounted] = useState(false);

  // Handle client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <AuthProvider>
        <DataProvider>
          {mounted && <Routes />}
          <Toaster position="top-right" richColors closeButton />
        </DataProvider>
      </AuthProvider>
    </>
  );
};

export default App;
