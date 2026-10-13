import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Trash2,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Power,
  PowerOff,
  Globe,
  Server,
} from 'lucide-react';
import { Bot as BotType, Platform, BotStatus } from '../types';
import { formatUptime, getPlatformColor, getPlatformBg, getStatusColor, getStatusLabel } from '../store';

interface BotManagerProps {
  bots: BotType[];
  onUpdateBot: (id: string, updates: Partial<BotType>) => void;
  onDeleteBot: (id: string) => void;
  onAddBot: () => void;
}

export default function BotManager({ bots, onUpdateBot, onDeleteBot, onAddBot }: BotManagerProps) {
  const [search, setSearch] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<Platform | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<BotStatus | 'all'>('all');

  const filtered = bots.filter((bot) => {
    const matchesSearch = bot.name.toLowerCase().includes(search.toLowerCase()) ||
      bot.targetChannel.toLowerCase().includes(search.toLowerCase());
    const matchesPlatform = filterPlatform === 'all' || bot.platform === filterPlatform;
    const matchesStatus = filterStatus === 'all' || bot.status === filterStatus;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const handleToggle = (bot: BotType) => {
    if (bot.status === 'online' || bot.status === 'connecting') {
      onUpdateBot(bot.id, { status: 'offline', viewers: 0, uptime: 0 });
    } else {
      onUpdateBot(bot.id, { status: 'connecting' });
      setTimeout(() => {
        onUpdateBot(bot.id, { status: 'online', viewers: Math.floor(Math.random() * 30) + 1 });
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Bot Manager</h2>
          <p className="text-zinc-400 text-sm mt-1">Manage and control all bot instances</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => bots.forEach(b => {
              if (b.status !== 'online') {
                onUpdateBot(b.id, { status: 'connecting' });
                setTimeout(() => {
                  onUpdateBot(b.id, { status: 'online', viewers: Math.floor(Math.random() * 30) + 1 });
                }, 1500);
              }
            })}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium text-white transition-colors"
          >
            <Power size={16} />
            Start All
          </button>
          <button
            onClick={() => bots.forEach(b => {
              onUpdateBot(b.id, { status: 'offline', viewers: 0, uptime: 0 });
            })}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium text-white transition-colors"
          >
            <PowerOff size={16} />
            Stop All
          </button>
          <button
            onClick={onAddBot}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium text-white transition-colors"
          >
            <Plus size={16} />
            Add Bot
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search bots or channels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value as Platform | 'all')}
            className="px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Platforms</option>
            <option value="twitch">Twitch</option>
            <option value="youtube">YouTube</option>
            <option value="kick">Kick</option>
            <option value="trovo">Trovo</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as BotStatus | 'all')}
            className="px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="connecting">Connecting</option>
            <option value="idle">Idle</option>
            <option value="error">Error</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Bot List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((bot) => (
            <motion.div
              key={bot.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-all ${
                bot.status === 'online' ? 'ring-1 ring-emerald-500/20' : ''
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Bot Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${getPlatformBg(bot.platform)}`}>
                    <span className={`text-sm font-bold capitalize ${getPlatformColor(bot.platform)}`}>
                      {bot.platform[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white truncate">{bot.name}</p>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(bot.status)} ${
                        bot.status === 'online' ? 'animate-pulse' : ''
                      }`} />
                    </div>
                    <p className="text-xs text-zinc-500">
                      #{bot.targetChannel} • {getStatusLabel(bot.status)}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-zinc-500 text-xs">Viewers</p>
                    <p className="text-white font-medium">{bot.viewers}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-zinc-500 text-xs">Uptime</p>
                    <p className="text-white font-medium">{formatUptime(bot.uptime)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-zinc-500 text-xs">Messages</p>
                    <p className="text-white font-medium">{bot.messagesSent}</p>
                  </div>
                  <div className="hidden md:block text-center">
                    <p className="text-zinc-500 text-xs">Region</p>
                    <p className="text-white font-medium flex items-center gap-1">
                      <Globe size={12} />
                      {bot.region}
                    </p>
                  </div>
                  <div className="hidden lg:block text-center">
                    <p className="text-zinc-500 text-xs">Proxy</p>
                    <p className="text-white font-mono text-xs flex items-center gap-1">
                      <Server size={12} />
                      {bot.proxy}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(bot)}
                    className={`p-2 rounded-lg transition-colors ${
                      bot.status === 'online' || bot.status === 'connecting'
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                    }`}
                  >
                    {bot.status === 'online' || bot.status === 'connecting' ? (
                      <Pause size={16} />
                    ) : (
                      <Play size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => onUpdateBot(bot.id, {
                      status: 'connecting',
                      viewers: 0,
                      uptime: 0,
                    })}
                    className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                  >
                    <RefreshCw size={16} />
                  </button>
                  <button
                    onClick={() => onDeleteBot(bot.id)}
                    className="p-2 rounded-lg bg-zinc-700/50 text-zinc-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Filter size={40} className="mx-auto text-zinc-700 mb-3" />
            <p className="text-zinc-500">No bots match your filters</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-zinc-500 pt-2 border-t border-zinc-800">
        <span>Showing {filtered.length} of {bots.length} bots</span>
        <span>{bots.filter(b => b.status === 'online').length} active • {bots.filter(b => b.status === 'error').length} errors</span>
      </div>
    </div>
  );
}
