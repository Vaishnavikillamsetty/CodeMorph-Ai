import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ConversionProvider } from './context/ConversionContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { Hero } from './components/landing/Hero';
import { Features } from './components/landing/Features';
import { LanguagesGrid } from './components/landing/LanguagesGrid';
import { ModelsComparison } from './components/landing/ModelsComparison';
import { Pricing } from './components/landing/Pricing';
import { FAQ } from './components/landing/FAQ';
import { ConverterStudio } from './components/converter/ConverterStudio';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { HistoryPage } from './components/history/HistoryPage';
import { ProfileSettings } from './components/profile/ProfileSettings';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { PricingModal } from './components/billing/PricingModal';

const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isPricingModalOpen, setIsPricingModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* Universal Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={handleOpenAuth}
        onOpenPricing={() => setIsPricingModalOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <div>
            <Hero
              onStartConverting={() => setCurrentTab('converter')}
              onOpenAuth={() => handleOpenAuth('signup')}
            />
            <Features />
            <LanguagesGrid />
            <ModelsComparison />
            <Pricing onSelectPlan={() => setIsPricingModalOpen(true)} />
            <FAQ />
          </div>
        )}

        {currentTab === 'converter' && (
          <ConverterStudio
            onSuccessToast={(msg) => addToast('success', msg)}
            onErrorToast={(msg) => addToast('error', msg)}
            onOpenPricing={() => setIsPricingModalOpen(true)}
            onOpenAuth={() => handleOpenAuth('login')}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardOverview
            onNavigate={setCurrentTab}
            onOpenPricing={() => setIsPricingModalOpen(true)}
          />
        )}

        {currentTab === 'history' && (
          <HistoryPage
            onNavigateToStudio={() => setCurrentTab('converter')}
            onSuccessToast={(msg) => addToast('success', msg)}
            onErrorToast={(msg) => addToast('error', msg)}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileSettings
            onSuccessToast={(msg) => addToast('success', msg)}
            onErrorToast={(msg) => addToast('error', msg)}
          />
        )}

        {currentTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Universal SaaS Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccessToast={(msg) => addToast('success', msg)}
      />

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        onSuccessToast={(msg) => addToast('success', msg)}
      />

      {/* Interactive Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ConversionProvider>
          <AppContent />
        </ConversionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
