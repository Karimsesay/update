import React, { useState, useEffect } from 'react';
import { 
  Currency, 
  Language, 
  UserProfile, 
  Product, 
  CartItem, 
  Order, 
  Shipment, 
  WarehouseLocation, 
  CustomsDoc, 
  AdBanner, 
  OfflineAction, 
  SupplierProfile, 
  CustomerTestimonial 
} from './types';
import { StorageService } from './services/storage';
import { Header } from './components/Header';
import { AnnouncementBar } from './components/AnnouncementBar';
import { WelcomeBanner } from './components/WelcomeBanner';
import { Storefront } from './components/Storefront';
import { TrackingView } from './components/TrackingView';
import { CustomsDocsView } from './components/CustomsDocsView';
import { LandedCostCalculator } from './components/LandedCostCalculator';
import { WaitingRoomView } from './components/WaitingRoomView';
import { PrintingShopView } from './components/PrintingShopView';
import { AdminPanel } from './components/AdminPanel';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { Footer } from './components/Footer';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('store');
  const [currency, setCurrency] = useState<Currency>('SLE');
  const [language, setLanguage] = useState<Language>('en');
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // User Google Profile State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('gll_me_google_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);

  // Core Data States (persistent via localStorage)
  const [products, setProducts] = useState<Product[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseLocation[]>([]);
  const [customsDocs, setCustomsDocs] = useState<CustomsDoc[]>([]);
  const [ads, setAds] = useState<AdBanner[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>([]);
  const [testimonials, setTestimonials] = useState<CustomerTestimonial[]>([]);
  const [offlineActions, setOfflineActions] = useState<OfflineAction[]>([]);

  // Cart & UI Modals
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('gll_me_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Initialize and load persistent data
  const loadAllData = () => {
    setProducts(StorageService.getProducts());
    setShipments(StorageService.getShipments());
    setOrders(StorageService.getOrders());
    setWarehouses(StorageService.getWarehouses());
    setCustomsDocs(StorageService.getCustomsDocs());
    setAds(StorageService.getAds());
    setSuppliers(StorageService.getSuppliers());
    setTestimonials(StorageService.getTestimonials());
    setOfflineActions(StorageService.getOfflineActions());
  };

  useEffect(() => {
    loadAllData();

    // Online/Offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save Cart on changes
  useEffect(() => {
    try {
      localStorage.setItem('gll_me_cart_v1', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Handle Google Auth
  const handleGoogleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('gll_me_google_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to save user', e);
    }
  };

  const handleGoogleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('gll_me_google_user');
    } catch (e) {
      console.warn('Failed to remove user', e);
    }
  };

  // Cart Actions
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: Math.min(item.product.stock, newQty) } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleOrderCompleted = (order: Order) => {
    setCartItems([]);
    loadAllData();
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      
      {/* Top Promotional Announcement Bar */}
      <AnnouncementBar
        ads={ads}
        onNavigate={(view) => setCurrentView(view)}
      />

      {/* Primary Top Bar Navigation */}
      <Header
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        currency={currency}
        onCurrencyChange={(c) => setCurrency(c)}
        language={language}
        onLanguageChange={(l) => setLanguage(l)}
        currentUser={currentUser}
        onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
        isOnline={isOnline}
      />

      {/* Welcome Banner */}
      <WelcomeBanner
        language={language}
        currentUser={currentUser}
        onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
        onNavigate={(view) => setCurrentView(view)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'store' && (
          <Storefront
            products={products}
            currency={currency}
            testimonials={testimonials}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onNavigateToTracking={() => setCurrentView('tracking')}
            onRefreshTestimonials={() => setTestimonials(StorageService.getTestimonials())}
          />
        )}

        {currentView === 'tracking' && (
          <TrackingView
            shipments={shipments}
          />
        )}

        {currentView === 'waitingRoom' && (
          <WaitingRoomView
            language={language}
            orders={orders}
          />
        )}

        {currentView === 'printingShop' && (
          <PrintingShopView
            language={language}
            orders={orders}
            shipments={shipments}
            customsDocs={customsDocs}
            products={products}
          />
        )}

        {currentView === 'customs' && (
          <CustomsDocsView
            customsDocs={customsDocs}
            shipments={shipments}
            onRefreshDocs={() => setCustomsDocs(StorageService.getCustomsDocs())}
          />
        )}

        {currentView === 'calculator' && (
          <LandedCostCalculator />
        )}

        {currentView === 'admin' && (
          <AdminPanel
            products={products}
            orders={orders}
            warehouses={warehouses}
            ads={ads}
            suppliers={suppliers}
            offlineActions={offlineActions}
            isOnline={isOnline}
            onRefreshProducts={() => setProducts(StorageService.getProducts())}
            onRefreshOrders={() => setOrders(StorageService.getOrders())}
            onRefreshAds={() => setAds(StorageService.getAds())}
            onRefreshSuppliers={() => setSuppliers(StorageService.getSuppliers())}
            onRefreshOffline={() => setOfflineActions(StorageService.getOfflineActions())}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(view) => setCurrentView(view)}
      />

      {/* Product Detail Modal with 6-Month Recharts Price History */}
      <ProductModal
        product={selectedProduct}
        currency={currency}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currency={currency}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveFromCart}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal with GTB, AfriMoney (+232 33 434592, no agent code), and Tax Invoice / Receipt */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        currentUser={currentUser}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Google Authentication Modal */}
      <GoogleAuthModal
        isOpen={isGoogleAuthOpen}
        onClose={() => setIsGoogleAuthOpen(false)}
        currentUser={currentUser}
        onLogin={handleGoogleLogin}
        onLogout={handleGoogleLogout}
      />

      {/* Gemini AI Trade Advisor Modal */}
      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />

    </div>
  );
}
