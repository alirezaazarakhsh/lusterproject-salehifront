import React, { useEffect, useState } from 'react';
import { HomePage } from './pages/HomePage';
import { HeaderSection } from './components/sections/HeaderSection';
import { ServerErrorContentSection } from './components/sections/ServerErrorContentSection';
import { navigateToRoute } from './utils/navigation';
import { syncFromFirestore, apiFetchWithFallback } from './utils/localBackendFallback';
import { loadDeletedKeysFromFirestore } from './lib/firestoreSync';
import { PagePreloader } from './components/PagePreloader';
import { SecurityProtection } from './components/SecurityProtection';
import { PWAInstallPopup } from './components/PWAInstallPopup';

interface AppErrorBoundaryState {
  hasError: boolean;
}

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  AppErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AppErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          dir="rtl"
          className="min-h-screen w-full bg-[#121212] text-[#f0f0f0] overflow-x-clip"
        >
          <div className="hidden md:block">
            <HeaderSection
              currentRoute="server-error"
              onNavigateRoute={(route, hashAnchor) => {
                this.setState({ hasError: false });
                navigateToRoute(route, hashAnchor);
              }}
              totalCartCount={0}
              onOpenCart={() => {}}
              onOpen3DStudio={() => {}}
            />
          </div>
          <ServerErrorContentSection
            onRetry={() => {
              this.setState({ hasError: false });
              navigateToRoute('home');
            }}
          />
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * نقطه ورود اصلی اپلیکیشن گالری لوستر اکبر صالحی
 */
export function App() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initBackgroundSync() {
      try {
        await loadDeletedKeysFromFirestore();
        try {
          await apiFetchWithFallback('/api/public/catalog');
        } catch (catErr) {
          console.warn('Initial server catalog fetch notice:', catErr);
        }
        await syncFromFirestore();
      } catch (err) {
        console.error('Failed to initialize app data:', err);
      }
    }
    initBackgroundSync();
  }, []);

  return (
    <AppErrorBoundary>
      <SecurityProtection />
      <PWAInstallPopup />
      <PagePreloader isVisible={isLoading} />
      {!isLoading && <HomePage />}
    </AppErrorBoundary>
  );
}

export default App;
