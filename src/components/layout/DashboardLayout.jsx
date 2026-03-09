import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Bell, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';

const pageTitles = {
  '/admin': 'Dashboard Overview',
  '/admin/users': 'Users & Accounts',
  '/admin/ai': 'AI Model Management',
  '/hospital': 'Hospital Dashboard',
  '/hospital/requests': 'Blood Requests',
  '/hospital/stock': 'Stock Management',
  '/hospital/predictions': 'AI Predictions',
  '/donor': 'My Dashboard',
  '/donor/nearby': 'Donation Centers',
  '/donor/history': 'Donation History',
  '/donor/impact': 'My Impact',
  '/donor/rewards': 'Rewards & Badges',
};

export default function DashboardLayout({ role }) {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || 'Dashboard';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar — always visible */}
      <div className="hidden lg:block">
        <Sidebar role={role} />
      </div>

      {/* Mobile sidebar — overlay drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <Sidebar role={role} onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-14 sm:h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Menu size={22} className="text-gray-700" />
            </button>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{title}</h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search (decorative) */}
            <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 text-sm text-gray-400 w-64">
              <Search size={16} />
              <span>Search...</span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
              <Bell size={20} className="text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="p-4 sm:p-6"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
