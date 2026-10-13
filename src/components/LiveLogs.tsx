import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Pause, Play, Download, Filter, ArrowDown } from 'lucide-react';
import { LogEntry, Platform } from '../types';
import { getPlatformColor } from '../store';

interface LiveLogsProps {
  logs: LogEntry[];
  onClear: () => void;
}

export default function LiveLogs({ logs, onClear }: LiveLogsProps) {
  const [paused, setPaused] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPlatform, setFilterPlatform] = useState<Platform | 'all'>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && !paused && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [logs, autoScroll, paused]);

  const filtered = logs.filter((log) => {
    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesPlatform = filterPlatform === 'all' || log.platform === filterPlatform;
    return matchesType && matchesPlatform;
  });

  const typeColors: Record<string, string> = {
    info: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    error: 'text-red-400 bg-red-500/10 border-red-500/20',
    chat: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  };

  const typeIcons: Record<string, string> = {
    info: 'ℹ',
    success: '✓',
    warning: '⚠',
    error: '✗',
    chat: '💬',
  };

  const exportLogs = () => {
    const text = logs.map(log =>
      `[${new Date(log.timestamp).toLocaleTimeString()}] [${log.type.toUpperCase()}] ${log.botName ? `(${log.botName}) ` : ''}${log.message}`
    ).join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `streamboost-logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Live Logs</h2>
          <p className="text-zinc-400 text-sm mt-1">Real-time event stream from all bots</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-zinc-800 rounded-lg">
            <div className={`w-2 h-2 rounded-full ${paused ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
            <span className="text-xs text-zinc-400">{paused ? 'Paused' : 'Live'}</span>
          </div>
          <button
            onClick={() => setPaused(!paused)}
            className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button
            onClick={exportLogs}
            className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <Download size={16} />
          </button>
          <button
            onClick={onClear}
            className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
        >
          <option value="all">All Types</option>
          <option value="info">Info</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
          <option value="chat">Chat</option>
        </select>
        <select
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value as Platform | 'all')}
          className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
        >
          <option value="all">All Platforms</option>
          <option value="twitch">Twitch</option>
          <option value="youtube">YouTube</option>
          <option value="kick">Kick</option>
          <option value="trovo">Trovo</option>
        </select>
        <label className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-400 cursor-pointer">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
            className="w-3 h-3 rounded accent-purple-500"
          />
          Auto-scroll
        </label>
        <span className="flex items-center gap-1 px-3 py-2 text-xs text-zinc-500">
          <Filter size={12} />
          {filtered.length} entries
        </span>
      </div>

      {/* Log Container */}
      <div
        ref={containerRef}
        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden min-h-[400px] max-h-[600px]"
      >
        <div className="p-1 overflow-y-auto h-full max-h-[600px] space-y-0.5">
          <AnimatePresence initial={false}>
            {filtered.slice(0, 200).map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-start gap-2 px-3 py-1.5 rounded border-l-2 text-xs font-mono ${typeColors[log.type]}`}
              >
                <span className="text-zinc-600 flex-shrink-0 w-[72px]">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="flex-shrink-0 w-4 text-center">{typeIcons[log.type]}</span>
                {log.botName && (
                  <span className={`flex-shrink-0 capitalize ${getPlatformColor(log.platform!)}`}>
                    [{log.botName}]
                  </span>
                )}
                <span className="text-zinc-300 break-all">{log.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
              No log entries
            </div>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
        <div className="flex items-center gap-4">
          <span>Info: {logs.filter(l => l.type === 'info').length}</span>
          <span>Success: {logs.filter(l => l.type === 'success').length}</span>
          <span>Warnings: {logs.filter(l => l.type === 'warning').length}</span>
          <span>Errors: {logs.filter(l => l.type === 'error').length}</span>
          <span>Chat: {logs.filter(l => l.type === 'chat').length}</span>
        </div>
        <button
          onClick={() => {
            if (containerRef.current) containerRef.current.scrollTop = 0;
          }}
          className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowDown size={12} />
          Scroll to top
        </button>
      </div>
    </div>
  );
}
