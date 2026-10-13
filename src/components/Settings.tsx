import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Shield, Globe, Clock, Zap, Database, Key, Bell } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    maxBots: 50,
    autoReconnect: true,
    proxyRotation: true,
    rateLimitBuffer: 80,
    heartbeatInterval: 30,
    messageDelay: 1500,
    maxRetries: 3,
    logRetention: 7,
    enableNotifications: true,
    darkMode: true,
    compactMode: false,
    autoStartBots: false,
    encryptionEnabled: true,
    twitchClientId: '',
    twitchClientSecret: '',
    youtubeApiKey: '',
    kickToken: '',
    trovoToken: '',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateSetting = (key: string, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="text-zinc-400 text-sm mt-1">Configure your bot control panel</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
            saved
              ? 'bg-emerald-600 text-white'
              : 'bg-purple-600 hover:bg-purple-500 text-white'
          }`}
        >
          <Save size={16} />
          {saved ? 'Saved!' : 'Save Changes'}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className="text-purple-400" />
            <h3 className="text-lg font-semibold text-white">General</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400 block mb-1">Max Bot Instances</label>
              <input
                type="number"
                value={settings.maxBots}
                onChange={(e) => updateSetting('maxBots', Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 block mb-1">Message Delay (ms)</label>
              <input
                type="number"
                value={settings.messageDelay}
                onChange={(e) => updateSetting('messageDelay', Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 block mb-1">Max Retries</label>
              <input
                type="number"
                value={settings.maxRetries}
                onChange={(e) => updateSetting('maxRetries', Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Auto-reconnect on disconnect</span>
              <button
                onClick={() => updateSetting('autoReconnect', !settings.autoReconnect)}
                className={`w-10 h-5 rounded-full transition-colors ${
                  settings.autoReconnect ? 'bg-purple-600' : 'bg-zinc-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.autoReconnect ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Auto-start bots on launch</span>
              <button
                onClick={() => updateSetting('autoStartBots', !settings.autoStartBots)}
                className={`w-10 h-5 rounded-full transition-colors ${
                  settings.autoStartBots ? 'bg-purple-600' : 'bg-zinc-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.autoStartBots ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Proxy & Network */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={18} className="text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Proxy & Network</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Proxy rotation</span>
              <button
                onClick={() => updateSetting('proxyRotation', !settings.proxyRotation)}
                className={`w-10 h-5 rounded-full transition-colors ${
                  settings.proxyRotation ? 'bg-purple-600' : 'bg-zinc-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.proxyRotation ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            <div>
              <label className="text-sm text-zinc-400 block mb-1">Rate Limit Buffer (%)</label>
              <input
                type="number"
                value={settings.rateLimitBuffer}
                onChange={(e) => updateSetting('rateLimitBuffer', Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
              />
              <p className="text-xs text-zinc-600 mt-1">Stay below this % of platform rate limits</p>
            </div>
            <div>
              <label className="text-sm text-zinc-400 block mb-1">Heartbeat Interval (s)</label>
              <input
                type="number"
                value={settings.heartbeatInterval}
                onChange={(e) => updateSetting('heartbeatInterval', Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Security</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Encrypt stored tokens</span>
              <button
                onClick={() => updateSetting('encryptionEnabled', !settings.encryptionEnabled)}
                className={`w-10 h-5 rounded-full transition-colors ${
                  settings.encryptionEnabled ? 'bg-purple-600' : 'bg-zinc-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.encryptionEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            <div>
              <label className="text-sm text-zinc-400 block mb-1">Log Retention (days)</label>
              <input
                type="number"
                value={settings.logRetention}
                onChange={(e) => updateSetting('logRetention', Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <p className="text-xs text-emerald-400">
                ✓ AES-256-GCM encryption enabled for all stored credentials
              </p>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Key size={18} className="text-amber-400" />
            <h3 className="text-lg font-semibold text-white">API Keys</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Twitch Client ID</label>
              <input
                type="password"
                value={settings.twitchClientId}
                onChange={(e) => updateSetting('twitchClientId', e.target.value)}
                placeholder="Enter Twitch Client ID"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Twitch Client Secret</label>
              <input
                type="password"
                value={settings.twitchClientSecret}
                onChange={(e) => updateSetting('twitchClientSecret', e.target.value)}
                placeholder="Enter Twitch Client Secret"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">YouTube API Key</label>
              <input
                type="password"
                value={settings.youtubeApiKey}
                onChange={(e) => updateSetting('youtubeApiKey', e.target.value)}
                placeholder="Enter YouTube API Key"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Kick Token</label>
              <input
                type="password"
                value={settings.kickToken}
                onChange={(e) => updateSetting('kickToken', e.target.value)}
                placeholder="Enter Kick token"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Trovo Token</label>
              <input
                type="password"
                value={settings.trovoToken}
                onChange={(e) => updateSetting('trovoToken', e.target.value)}
                placeholder="Enter Trovo token"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-pink-400" />
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Enable notifications</span>
              <button
                onClick={() => updateSetting('enableNotifications', !settings.enableNotifications)}
                className={`w-10 h-5 rounded-full transition-colors ${
                  settings.enableNotifications ? 'bg-purple-600' : 'bg-zinc-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.enableNotifications ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Dark mode</span>
              <button
                onClick={() => updateSetting('darkMode', !settings.darkMode)}
                className={`w-10 h-5 rounded-full transition-colors ${
                  settings.darkMode ? 'bg-purple-600' : 'bg-zinc-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.darkMode ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Compact mode</span>
              <button
                onClick={() => updateSetting('compactMode', !settings.compactMode)}
                className={`w-10 h-5 rounded-full transition-colors ${
                  settings.compactMode ? 'bg-purple-600' : 'bg-zinc-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.compactMode ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Database */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Database size={18} className="text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Database</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              <p className="text-xs text-zinc-500">Engine</p>
              <p className="text-sm text-white font-medium">SQLite (better-sqlite3)</p>
            </div>
            <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              <p className="text-xs text-zinc-500">Location</p>
              <p className="text-sm text-white font-mono">./data/dashboard.db</p>
            </div>
            <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              <p className="text-xs text-zinc-500">Size</p>
              <p className="text-sm text-white font-medium">2.4 MB</p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 hover:bg-zinc-700 transition-colors">
                Backup
              </button>
              <button className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 hover:bg-zinc-700 transition-colors">
                Restore
              </button>
              <button className="flex-1 px-3 py-2 bg-red-900/30 border border-red-500/30 rounded-lg text-xs text-red-400 hover:bg-red-900/50 transition-colors">
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
