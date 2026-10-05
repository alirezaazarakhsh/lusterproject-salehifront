import React from 'react';
import { HomePage } from './pages/HomePage';
import { HeaderSection } from './components/sections/HeaderSection';
import { ServerErrorContentSection } from './server-error';
import { navigateToRoute } from './utils/navigation';

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
          className="min-h-screen w-full bg-[#fcfbf9] text-[#222222] overflow-x-hidden"
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
  return (
    <AppErrorBoundary>
      <HomePage />
    </AppErrorBoundary>
  );
}

export default App;
