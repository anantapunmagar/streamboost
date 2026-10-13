import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  ScrollText,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'bots', label: 'Bot Manager', icon: <Bot size={20} /> },
  { id: 'composer', label: 'Composer', icon: <MessageSquare size={20} /> },
  { id: 'logs', label: 'Live Logs', icon: <ScrollText size={20} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

export default function Sidebar({ activeTab, onTabChange, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.2 }}
      className="fixed left-0 top-0 h-full bg-zinc-900 border-r border-zinc-800 flex flex-col z-50"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
          <Zap size={20} className="text-white" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1 className="text-lg font-bold text-white">StreamBoost</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Control Panel</p>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
              activeTab === tab.id
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <span className="flex-shrink-0">{tab.icon}</span>
            {!collapsed && (
              <span className="text-sm font-medium">{tab.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-zinc-800">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>

      {/* Status */}
      {!collapsed && (
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-zinc-400">System Online</span>
          </div>
          <p className="text-[10px] text-zinc-600 mt-1">v2.4.1 • Node.js 20.x</p>
        </div>
      )}
    </motion.aside>
  );
}
