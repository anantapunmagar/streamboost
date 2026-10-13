import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BotManager from './components/BotManager';
import MessageComposer from './components/MessageComposer';
import LiveLogs from './components/LiveLogs';
import SettingsPage from './components/Settings';
import AddBotModal from './components/AddBotModal';
import { TabType, Bot, LogEntry, Platform } from './types';
import { generateBots, generateLogEntry } from './store';
import { v4 as uuid } from 'uuid';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [bots, setBots] = useState<Bot[]>(() => generateBots(20));
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Generate initial logs
  useEffect(() => {
    const initialLogs: LogEntry[] = [];
    for (let i = 0; i < 30; i++) {
      initialLogs.push(generateLogEntry(bots));
    }
    setLogs(initialLogs);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Add new log
      const newLog = generateLogEntry(bots);
      setLogs(prev => [newLog, ...prev].slice(0, 500));

      // Update bot stats
      setBots(prev => prev.map(bot => {
        if (bot.status === 'online') {
          return {
            ...bot,
            uptime: bot.uptime + 3,
            viewers: Math.max(0, bot.viewers + Math.floor(Math.random() * 5) - 2),
            messagesSent: bot.messagesSent + (Math.random() > 0.7 ? 1 : 0),
          };
        }
        if (bot.status === 'connecting') {
          return {
            ...bot,
            status: Math.random() > 0.3 ? 'online' : 'connecting',
            viewers: Math.random() > 0.5 ? Math.floor(Math.random() * 10) + 1 : 0,
          };
        }
        return bot;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [bots]);

  const handleUpdateBot = useCallback((id: string, updates: Partial<Bot>) => {
    setBots(prev => prev.map(bot =>
      bot.id === id ? { ...bot, ...updates } : bot
    ));
  }, []);

  const handleDeleteBot = useCallback((id: string) => {
    setBots(prev => prev.filter(bot => bot.id !== id));
  }, []);

  const handleAddBot = useCallback(() => {
    setShowAddModal(true);
  }, []);

  const handleCreateBot = useCallback((data: { name: string; platform: Platform; targetChannel: string; proxy: string; region: string }) => {
    const newBot: Bot = {
      id: uuid(),
      name: data.name,
      platform: data.platform,
      status: 'offline',
      targetChannel: data.targetChannel,
      viewers: 0,
      uptime: 0,
      messagesSent: 0,
      lastActive: new Date().toISOString(),
      proxy: data.proxy,
      region: data.region,
    };
    setBots(prev => [newBot, ...prev]);
  }, []);

  const handleSendMessage = useCallback((botId: string, message: string) => {
    const bot = bots.find(b => b.id === botId);
    if (!bot) return;

    const log: LogEntry = {
      id: uuid(),
      timestamp: new Date().toISOString(),
      type: 'success',
      botId: bot.id,
      botName: bot.name,
      platform: bot.platform,
      message: `Sent: "${message}"`,
    };
    setLogs(prev => [log, ...prev]);

    setBots(prev => prev.map(b =>
      b.id === botId ? { ...b, messagesSent: b.messagesSent + 1 } : b
    ));
  }, [bots]);

  const handleClearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard bots={bots} />;
      case 'bots':
        return (
          <BotManager
            bots={bots}
            onUpdateBot={handleUpdateBot}
            onDeleteBot={handleDeleteBot}
            onAddBot={handleAddBot}
          />
        );
      case 'composer':
        return (
          <MessageComposer
            bots={bots}
            onSendMessage={handleSendMessage}
          />
        );
      case 'logs':
        return <LiveLogs logs={logs} onClear={handleClearLogs} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main
        className="transition-all duration-200"
        style={{ marginLeft: sidebarCollapsed ? 72 : 240 }}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-zinc-400">System Online</span>
              </div>
              <span className="text-zinc-700">|</span>
              <span className="text-xs text-zinc-500">
                {bots.filter(b => b.status === 'online').length} bots active • {bots.reduce((s, b) => s + b.viewers, 0)} total viewers
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold">
                  A
                </div>
                <span className="text-xs text-zinc-300">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </main>

      {/* Add Bot Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddBotModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAdd={handleCreateBot}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
