import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { Platform } from '../types';

interface AddBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { name: string; platform: Platform; targetChannel: string; proxy: string; region: string }) => void;
}

const regions = ['US-East', 'US-West', 'EU-West', 'EU-Central', 'Asia-Tokyo', 'Asia-Singapore', 'SA-Brazil'];

export default function AddBotModal({ isOpen, onClose, onAdd }: AddBotModalProps) {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<Platform>('twitch');
  const [targetChannel, setTargetChannel] = useState('');
  const [proxy, setProxy] = useState('');
  const [region, setRegion] = useState('US-East');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetChannel) return;
    onAdd({ name, platform, targetChannel, proxy: proxy || 'auto', region });
    setName('');
    setTargetChannel('');
    setProxy('');
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Plus size={20} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Add New Bot</h3>
              <p className="text-xs text-zinc-500">Configure a new bot instance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400 block mb-1">Bot Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., viewer_alpha"
              className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 block mb-1">Platform</label>
            <div className="grid grid-cols-4 gap-2">
              {(['twitch', 'youtube', 'kick', 'trovo'] as Platform[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                    platform === p
                      ? p === 'twitch' ? 'bg-purple-500/30 border-purple-500/50 text-purple-300 border' :
                        p === 'youtube' ? 'bg-red-500/30 border-red-500/50 text-red-300 border' :
                        p === 'kick' ? 'bg-green-500/30 border-green-500/50 text-green-300 border' :
                        'bg-blue-500/30 border-blue-500/50 text-blue-300 border'
                      : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-zinc-400 block mb-1">Target Channel</label>
            <input
              type="text"
              value={targetChannel}
              onChange={(e) => setTargetChannel(e.target.value)}
              placeholder="e.g., xqc"
              className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 block mb-1">Proxy (optional)</label>
            <input
              type="text"
              value={proxy}
              onChange={(e) => setProxy(e.target.value)}
              placeholder="ip:port or leave empty for auto"
              className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 block mb-1">Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
            >
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium text-white transition-colors"
            >
              Create Bot
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
