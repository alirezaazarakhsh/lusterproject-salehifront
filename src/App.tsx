import React, { useEffect, useState } from 'react';
import { HomePage } from './pages/HomePage';
import { HeaderSection } from './components/sections/HeaderSection';
import { ServerErrorContentSection } from './components/sections/ServerErrorContentSection';
import { navigateToRoute } from './utils/navigation';
import { syncFromFirestore, apiFetchWithFallback } from './utils/localBackendFallback';
import { loadDeletedKeysFromFirestore } from './lib/firestoreSync';
import { PagePreloader } from './components/PagePreloader';
import { initTheme } from './utils/theme';

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
          className="min-h-screen w-full bg-[#fcfbf9] text-[#222222] overflow-x-clip"
        >
          {/* در دسکتاپ هدر دارد و در موبایل بدون هدر و بدون فوتر دقیقاً مانند ۴۰۴ */}
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        await loadDeletedKeysFromFirestore();
        // ابتدا کاتالوگ زنده سرور دریافت و کش می‌شود تا دیتای واقعی لود شود
        try {
          await apiFetchWithFallback('/api/public/catalog');
        } catch (catErr) {
          console.warn('Initial server catalog fetch notice:', catErr);
        }
        await syncFromFirestore();
      } catch (err) {
        console.error('Failed to initialize app data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  return (
    <AppErrorBoundary>
      <PagePreloader isVisible={isLoading} />
      {!isLoading && <HomePage />}
    </AppErrorBoundary>
  );
}

export default App;
