import React, { useState, useEffect } from 'react';

export const PWAInstallPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (!isStandalone) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000); // Close after 5 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-4 z-50 flex items-center gap-3 rounded-xl bg-white p-4 shadow-2xl border border-gray-100 animate-fade-in-down">
      <div className="text-sm text-gray-800">
        برای دسترسی سریع، برنامه را نصب کنید!
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-xs text-gray-500 hover:text-gray-800"
      >
        بستن
      </button>
    </div>
  );
};
