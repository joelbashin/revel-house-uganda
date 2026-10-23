import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { AdminLogin } from './layout/AdminLogin';
import { AdminLayout } from './layout/AdminLayout';
import { DashboardOverview } from './pages/DashboardOverview';
import { AdminProgramsPage } from './pages/AdminProgramsPage';
import { AdminProjectsPage } from './pages/AdminProjectsPage';
import { AdminArticlesPage } from './pages/AdminArticlesPage';
import { AdminStatsPage } from './pages/AdminStatsPage';
import { AdminGalleryPage } from './pages/AdminGalleryPage';
import { AdminMediaPage } from './pages/AdminMediaPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';
import { AdminAIContentGenerator } from './pages/AdminAIContentGenerator';

function AdminShell() {
  const { user, loading } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePop = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8F6] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#111111]/20 border-t-[#69B53F] animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase tracking-widest text-[#111111]/60">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  if (!user || currentPath === '/admin/login') {
    if (user && currentPath === '/admin/login') {
      navigate('/admin');
    }
    return <AdminLogin onNavigate={navigate} />;
  }

  const renderPage = () => {
    if (currentPath === '/admin/programs') return <AdminProgramsPage />;
    if (currentPath === '/admin/projects') return <AdminProjectsPage />;
    if (currentPath === '/admin/articles') return <AdminArticlesPage />;
    if (currentPath === '/admin/gallery') return <AdminGalleryPage />;
    if (currentPath === '/admin/stats') return <AdminStatsPage />;
    if (currentPath === '/admin/media') return <AdminMediaPage />;
    if (currentPath === '/admin/ai-generator') return <AdminAIContentGenerator />;
    if (currentPath === '/admin/settings') return <AdminSettingsPage />;
    return <DashboardOverview onNavigate={navigate} />;
  };

  return (
    <AdminLayout currentPath={currentPath} onNavigate={navigate}>
      {renderPage()}
    </AdminLayout>
  );
}

export function AdminApp() {
  return (
    <AuthProvider>
      <AdminShell />
    </AuthProvider>
  );
}
