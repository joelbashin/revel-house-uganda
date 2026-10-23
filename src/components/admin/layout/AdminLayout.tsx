import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function AdminLayout({ children, currentPath, onNavigate }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--c-bg)] flex">
      <AdminSidebar
        currentPath={currentPath}
        onNavigate={(path) => {
          onNavigate(path);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={async () => {
          await logout();
          onNavigate('/admin/login');
        }}
      />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <AdminHeader
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          userName={user?.email || 'Admin'}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
