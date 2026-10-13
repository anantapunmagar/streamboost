import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Clock, Zap, Copy, Check, RotateCcw } from 'lucide-react';
import { Bot as BotType } from '../types';
import { getPlatformColor } from '../store';

interface MessageComposerProps {
  bots: BotType[];
  onSendMessage: (botId: string, message: string) => void;
}

const quickTemplates = [
  { label: 'Hello Chat!', message: 'Hey everyone! 👋 Great stream today!' },
  { label: 'GG', message: 'GG! That was insane 🔥' },
  { label: 'Follow', message: 'Don\'t forget to follow for more content!' },
  { label: 'Discord', message: 'Join our Discord: discord.gg/example' },
  { label: 'Hype', message: 'LET\'S GOOOOO 🚀🚀🚀' },
  { label: 'Question', message: 'What game are we playing next?' },
  { label: 'Shoutout', message: 'Shoutout to the mods! You guys are the best 💜' },
  { label: 'Lurk', message: 'Lurking and vibing 🎵' },
];

export default function MessageComposer({ bots, onSendMessage }: MessageComposerProps) {
  const [selectedBots, setSelectedBots] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [sendMode, setSendMode] = useState<'single' | 'broadcast'>('single');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [delay, setDelay] = useState(1000);

  const activeBots = bots.filter(b => b.status === 'online');

  const handleSend = async () => {
    if (!message.trim()) return;
    if (sendMode === 'single' && selectedBots.length === 0) return;

    setSending(true);
    const targets = sendMode === 'broadcast' ? activeBots : bots.filter(b => selectedBots.includes(b.id));

    for (const bot of targets) {
      await new Promise(resolve => setTimeout(resolve, delay));
      onSendMessage(bot.id, message);
    }

    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 2000);
    setMessage('');
  };

  const toggleBot = (id: string) => {
    setSelectedBots(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedBots.length === activeBots.length) {
      setSelectedBots([]);
    } else {
      setSelectedBots(activeBots.map(b => b.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Message Composer</h2>
        <p className="text-zinc-400 text-sm mt-1">Send messages through your bots to live chats</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer */}
        <div className="lg:col-span-2 space-y-4">
          {/* Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setSendMode('single')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sendMode === 'single'
                  ? 'bg-purple-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Send size={14} />
              Single Bot
            </button>
            <button
              onClick={() => setSendMode('broadcast')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sendMode === 'broadcast'
                  ? 'bg-purple-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Zap size={14} />
              Broadcast All
            </button>
          </div>

          {/* Bot Selection */}
          {sendMode === 'single' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-zinc-300">Select Bot(s)</h3>
                <button
                  onClick={selectAll}
                  className="text-xs text-purple-400 hover:text-purple-300"
                >
                  {selectedBots.length === activeBots.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                {activeBots.map((bot) => (
                  <button
                    key={bot.id}
                    onClick={() => toggleBot(bot.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${
                      selectedBots.includes(bot.id)
                        ? 'bg-purple-500/20 border-purple-500/50 text-white'
                        : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${selectedBots.includes(bot.id) ? 'bg-purple-400' : 'bg-emerald-500'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">{bot.name}</p>
                      <p className={`text-[10px] capitalize ${getPlatformColor(bot.platform)}`}>
                        {bot.platform} • #{bot.targetChannel}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              {activeBots.length === 0 && (
                <p className="text-sm text-zinc-500 text-center py-4">No active bots available</p>
              )}
            </div>
          )}

          {/* Message Input */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <label className="text-sm font-medium text-zinc-300 block mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-purple-500 transition-colors"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3">
                <label className="text-xs text-zinc-500 flex items-center gap-1">
                  <Clock size={12} />
                  Delay (ms):
                </label>
                <input
                  type="number"
                  value={delay}
                  onChange={(e) => setDelay(Number(e.target.value))}
                  min={200}
                  max={10000}
                  step={100}
                  className="w-20 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <span className="text-xs text-zinc-500">
                {message.length}/500 characters
              </span>
            </div>
          </div>

          {/* Send Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSend}
            disabled={sending || !message.trim() || (sendMode === 'single' && selectedBots.length === 0)}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
              sent
                ? 'bg-emerald-600 text-white'
                : sending
                ? 'bg-zinc-700 text-zinc-400 cursor-wait'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {sent ? (
              <>
                <Check size={18} />
                Message Sent!
              </>
            ) : sending ? (
              <>
                <RotateCcw size={18} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={18} />
                {sendMode === 'broadcast'
                  ? `Broadcast to ${activeBots.length} bots`
                  : `Send via ${selectedBots.length} bot(s)`}
              </>
            )}
          </motion.button>
        </div>

        {/* Quick Templates */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <h3 className="text-sm font-medium text-zinc-300 mb-3">Quick Templates</h3>
          <div className="space-y-2">
            {quickTemplates.map((template, i) => (
              <button
                key={i}
                onClick={() => setMessage(template.message)}
                className="w-full flex items-center justify-between p-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-left hover:border-zinc-600 transition-colors group"
              >
                <span className="text-xs text-zinc-300">{template.label}</span>
                <Copy size={12} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              </button>
            ))}
          </div>

          {/* Rate Limit Info */}
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-xs text-amber-400 font-medium">Rate Limit Info</p>
            <ul className="text-[10px] text-amber-400/70 mt-1 space-y-0.5">
              <li>• Twitch: ~20 msg/30s (normal)</li>
              <li>• YouTube: ~10 msg/60s</li>
              <li>• Kick: ~30 msg/30s</li>
              <li>• Recommended delay: 1000ms+</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
