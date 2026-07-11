import React, { useState, useEffect, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, CheckCircle2, Search } from 'lucide-react';
import { db } from './services/database';
import { auth } from './services/supabaseClient';
import { DbUser, Centre, AppView, NQSArea } from './services/types';
import { AppRouter } from './AppRouter';
import { Sidebar } from './components/Sidebar';

// Directly imported components for initial load
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';

// Lazy loaded components (only those not in AppRouter or needed here)
const Onboarding = React.lazy(() => import('./components/Onboarding').then(m => ({ default: m.Onboarding })));
const CentreOnboarding = React.lazy(() => import('./components/CentreOnboarding').then(m => ({ default: m.CentreOnboarding })));
const CommandPalette = React.lazy(() => import('./components/CommandPalette').then(m => ({ default: m.CommandPalette })));

const App: React.FC = () => {
  const [user, setUser] = useState<DbUser | null>(null);
  const [centre, setCentre] = useState<Centre | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedAreaForPlan, setSelectedAreaForPlan] = useState<NQSArea | undefined>();
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogin = (loggedInUser: any) => {
    const demoUser = {
      id: loggedInUser.email,
      email: loggedInUser.email,
      name: loggedInUser.name,
      role: loggedInUser.role as DbUser['role'],
      centreId: 'mock_centre_1',
      centreName: 'Sunshine Early Learning Centre',
      plan: 'centre',
      onboardingCompleted: true,
    } as DbUser;

    setUser(demoUser);
    try {
      localStorage.setItem('kindy_user', JSON.stringify(demoUser));
    } catch (error) {
      console.warn('Unable to persist demo session:', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCentre(null);
    setCurrentView(AppView.DASHBOARD);
    try {
      localStorage.removeItem('kindy_user');
    } catch (error) {
      console.warn('Unable to clear demo session:', error);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const timeoutId = setTimeout(() => {
        console.warn('App: Auth initialization timed out after 5s');
        setLoading(false);
      }, 5000);

      try {
        const { data: { session } } = await auth.getSession();
        if (session?.user) {
          const dbUser = await db.users.get(session.user.id);
          if (dbUser) {
            setUser(dbUser);
            if (dbUser.centreId) {
              const centreData = await db.centres.get(dbUser.centreId);
              setCentre(centreData);
            }
            if (!dbUser.onboardingCompleted) {
              setShowOnboarding(true);
            }
          }
        } else {
          const storedUser = localStorage.getItem('kindy_user');
          if (storedUser) {
            try {
              const demoUser = JSON.parse(storedUser) as DbUser;
              if (demoUser?.id) {
                setUser(demoUser);
                if (demoUser.centreId) {
                  const centreData = await db.centres.get(demoUser.centreId);
                  setCentre(centreData);
                }
              }
            } catch (error) {
              console.warn('App: Failed to restore demo session:', error);
            }
          }
        }
      } catch (error) {
        console.error('App: Auth initialization error:', error);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    initAuth();

    let subscription: any = null;
    try {
      const { data } = auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const dbUser = await db.users.get(session.user.id);
          setUser(dbUser);
          if (dbUser?.centreId) {
            const centreData = await db.centres.get(dbUser.centreId);
            setCentre(centreData);
          }
          if (dbUser && !dbUser.onboardingCompleted) {
            setShowOnboarding(true);
          }
        } else {
          setUser(null);
          setCentre(null);
          setShowOnboarding(false);
        }
        setLoading(false);
      });
      subscription = data.subscription;
    } catch (error) {
      console.error('App: onAuthStateChange error:', error);
      setLoading(false);
    }

    // Handle payment success from URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_success') === 'true') {
      setPaymentSuccess(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Command palette shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (subscription) subscription.unsubscribe();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-5">
            <span className="text-white text-xl font-extrabold">EY</span>
          </div>
          <div className="w-8 h-8 border-[3px] border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
          <p className="text-slate-500 text-sm font-semibold">Loading EarlyYearsOS…</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    const isLoginPage = window.location.pathname === '/login' || window.location.pathname === '/';
    return (
      <div className="min-h-screen bg-slate-50">
        <Toaster position="top-right" />
        {isLoginPage ? (
          <LoginPage onLogin={handleLogin} />
        ) : (
          <LandingPage onGetStarted={() => window.location.href = '/login'} onLogin={() => window.location.href = '/login'} />
        )}
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <Suspense fallback={<div>Loading onboarding...</div>}>
        <CentreOnboarding
          user={{ name: user.name, email: user.email }}
          onComplete={async (centreDetails) => {
            try {
              localStorage.setItem('eyos_centre_details', JSON.stringify(centreDetails));
            } catch {}
            const updatedUser = await db.users.get(user.id);
            if (updatedUser) {
              setUser(updatedUser);
              if (updatedUser.centreId) {
                const centreData = await db.centres.get(updatedUser.centreId);
                setCentre(centreData);
              }
            }
            setShowOnboarding(false);
          }}
        />
      </Suspense>
    );
  }

  return (
    <div className="h-screen bg-transparent flex overflow-hidden">
      <Toaster position="top-right" />
      <AnimatePresence>
        {showCommandPalette && (
          <Suspense fallback={null}>
            <CommandPalette 
              isOpen={showCommandPalette} 
              onClose={() => setShowCommandPalette(false)} 
              onNavigate={(view) => setCurrentView(view)}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {mobileNavOpen ? (
        <button
          type="button"
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[1px] md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        user={user}
        onLogout={handleLogout}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />

      <main className="relative flex-1 min-w-0 overflow-auto">
        <button
          type="button"
          aria-label="Open navigation"
          className="fixed left-3 top-3 z-30 rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-md md:hidden"
          onClick={() => setMobileNavOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Search"
          className="fixed right-3 top-3 z-30 rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-md md:hidden"
          onClick={() => setShowCommandPalette(true)}
        >
          <Search className="h-5 w-5" />
        </button>
        <AppRouter 
          currentView={currentView}
          user={user} 
          navigateTo={setCurrentView}
          navigateToPlan={(area) => {
            setSelectedAreaForPlan(area);
            setCurrentView(AppView.QIP_PLANNER);
          }}
          selectedAreaForPlan={selectedAreaForPlan}
        />
      </main>

      {/* Payment Success Modal */}
      <AnimatePresence>
        {paymentSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Subscription Activated!</h2>
              <p className="text-slate-600 mb-8">
                Welcome to EarlyYearsOS. Your premium features are now active and ready to use.
              </p>
              <button 
                onClick={() => setPaymentSuccess(false)}
                className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
              >
                Get Started
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;
