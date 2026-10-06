/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { HerbalAssistantModal } from './components/assistant/HerbalAssistantModal';
import { HomeView } from './components/home/HomeView';
import { ProductListView } from './components/shop/ProductListView';
import { ProductDetailView } from './components/shop/ProductDetailView';
import { HerbListView } from './components/herbs/HerbListView';
import { HerbDetailView } from './components/herbs/HerbDetailView';
import { AboutView } from './components/about/AboutView';
import { ContactView } from './components/contact/ContactView';
import { CheckoutView } from './components/checkout/CheckoutView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentRoute, toast } = useStore();

  const renderCurrentView = () => {
    switch (currentRoute) {
      case 'home':
        return <HomeView />;
      case 'products':
        return <ProductListView />;
      case 'product-detail':
        return <ProductDetailView />;
      case 'herbs':
        return <HerbListView />;
      case 'herb-detail':
        return <HerbDetailView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'checkout':
        return <CheckoutView />;
      case 'assistant':
        return <ProductListView />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomeView />;
    }
  };

  const isAdminView = currentRoute === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#223221]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-[#243323] text-[#FAF8F5] px-4 py-3 rounded-lg shadow-lg border border-[#3E513D] flex items-center gap-2.5 text-xs font-medium">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#89C07E]" />}
            {toast.type === 'warn' && <AlertTriangle className="w-4 h-4 text-[#E6A865]" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-[#A7B9A3]" />}
            <span>{toast.text}</span>
          </div>
        </div>
      )}

      {/* Main Header */}
      {!isAdminView && <Header />}

      {/* Main View Container */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* AI Botanical Guide Modal */}
      <HerbalAssistantModal />

      {/* Footer */}
      {!isAdminView && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
