import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  FolderOpen,
  FileText,
  Image,
  BarChart3,
  Upload,
  Settings,
  MessageSquare,
  LogOut,
  Shield,
  X,
} from 'lucide-react';

interface AdminSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/programs', label: 'Programs', icon: FolderKanban },
  { path: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { path: '/admin/articles', label: 'Articles', icon: FileText },
  { path: '/admin/gallery', label: 'Gallery', icon: Image },
  { path: '/admin/stats', label: 'Statistics', icon: BarChart3 },
  { path: '/admin/media', label: 'Media', icon: Upload },
  { path: '/admin/ai-generator', label: 'Ask Revel', icon: MessageSquare },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar({ currentPath, onNavigate, isOpen, onClose, onLogout }: AdminSidebarProps) {
  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#3B2F2F] text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#69B53F] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight" style={{ fontFamily: '"DM Serif Display", Georgia, serif' }}>Revel House</div>
              <div className="text-[10px] text-white/50 font-mono uppercase">Admin CMS</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || 
            (item.path !== '/admin' && currentPath.startsWith(item.path));
          const isAiItem = item.path === '/admin/ai-generator';
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isAiItem
                  ? 'glass-btn-nav'
                  : isActive
                    ? 'bg-gradient-to-r from-[#D35400] to-[#F4A300] text-white shadow-md'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => onNavigate('/')}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:bg-white/10 hover:text-white transition-colors mb-1"
        >
          <span>View Live Site</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
