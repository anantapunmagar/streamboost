import { motion } from 'framer-motion';
import { Bot, TrendingUp, Eye, MessageCircle, Clock, Wifi } from 'lucide-react';
import { Bot as BotType, Platform } from '../types';
import { formatUptime, getPlatformColor } from '../store';

interface DashboardProps {
  bots: BotType[];
}

export default function Dashboard({ bots }: DashboardProps) {
  const activeBots = bots.filter(b => b.status === 'online');
  const totalViewers = activeBots.reduce((sum, b) => sum + b.viewers, 0);
  const totalMessages = bots.reduce((sum, b) => sum + b.messagesSent, 0);
  const avgUptime = activeBots.length > 0
    ? Math.floor(activeBots.reduce((sum, b) => sum + b.uptime, 0) / activeBots.length)
    : 0;

  const platformCounts: Record<Platform, number> = {
    twitch: bots.filter(b => b.platform === 'twitch').length,
    youtube: bots.filter(b => b.platform === 'youtube').length,
    kick: bots.filter(b => b.platform === 'kick').length,
    trovo: bots.filter(b => b.platform === 'trovo').length,
  };

  const stats = [
    {
      label: 'Total Bots',
      value: bots.length,
      icon: <Bot size={22} />,
      color: 'from-purple-500 to-purple-700',
      change: '+3 today',
    },
    {
      label: 'Active Bots',
      value: activeBots.length,
      icon: <Wifi size={22} />,
      color: 'from-emerald-500 to-emerald-700',
      change: `${bots.length > 0 ? Math.round((activeBots.length / bots.length) * 100) : 0}% uptime`,
    },
    {
      label: 'Total Viewers',
      value: totalViewers.toLocaleString(),
      icon: <Eye size={22} />,
      color: 'from-blue-500 to-blue-700',
      change: '+12% vs last hour',
    },
    {
      label: 'Messages Sent',
      value: totalMessages.toLocaleString(),
      icon: <MessageCircle size={22} />,
      color: 'from-pink-500 to-pink-700',
      change: '+45 this session',
    },
    {
      label: 'Avg Uptime',
      value: formatUptime(avgUptime),
      icon: <Clock size={22} />,
      color: 'from-amber-500 to-amber-700',
      change: 'Stable',
    },
    {
      label: 'Success Rate',
      value: '98.7%',
      icon: <TrendingUp size={22} />,
      color: 'from-cyan-500 to-cyan-700',
      change: 'Last 24h',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        <p className="text-zinc-400 text-sm mt-1">Real-time monitoring of all bot instances</p>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            variants={item}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                <p className="text-xs text-zinc-500 mt-1">{stat.change}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Platform Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Platform Distribution</h3>
          <div className="space-y-3">
            {(Object.entries(platformCounts) as [Platform, number][]).map(([platform, count]) => {
              const percentage = bots.length > 0 ? (count / bots.length) * 100 : 0;
              return (
                <div key={platform} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium capitalize ${getPlatformColor(platform)}`}>
                      {platform}
                    </span>
                    <span className="text-sm text-zinc-400">{count} bots ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`h-full rounded-full ${
                        platform === 'twitch' ? 'bg-purple-500' :
                        platform === 'youtube' ? 'bg-red-500' :
                        platform === 'kick' ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Channels */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Active Channels</h3>
          <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
            {activeBots.slice(0, 10).map((bot) => (
              <div
                key={bot.id}
                className="flex items-center justify-between bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <p className="text-sm font-medium text-white">{bot.targetChannel}</p>
                    <p className={`text-xs capitalize ${getPlatformColor(bot.platform)}`}>
                      {bot.platform} • {bot.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{bot.viewers} viewers</p>
                  <p className="text-xs text-zinc-500">{formatUptime(bot.uptime)}</p>
                </div>
              </div>
            ))}
            {activeBots.length === 0 && (
              <p className="text-sm text-zinc-500 text-center py-4">No active bots</p>
            )}
          </div>
        </div>
      </div>

      {/* System Resources */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">System Resources</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: 'CPU Usage', value: 34, color: 'bg-purple-500' },
            { label: 'Memory', value: 62, color: 'bg-blue-500' },
            { label: 'Network I/O', value: 45, color: 'bg-emerald-500' },
            { label: 'Storage', value: 28, color: 'bg-amber-500' },
          ].map((resource) => (
            <div key={resource.label} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-zinc-400">{resource.label}</span>
                <span className="text-sm font-medium text-white">{resource.value}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${resource.value}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className={`h-full rounded-full ${resource.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
