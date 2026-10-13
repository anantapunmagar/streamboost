import { Bot, LogEntry, Platform } from './types';
import { v4 as uuid } from 'uuid';

const regions = ['US-East', 'US-West', 'EU-West', 'EU-Central', 'Asia-Tokyo', 'Asia-Singapore', 'SA-Brazil'];
const proxies = [
  '185.22.172.41:8080',
  '45.132.11.88:3128',
  '103.21.244.12:8888',
  '91.204.48.15:9090',
  '178.62.33.100:4444',
  '209.141.55.26:8383',
  '104.238.99.218:7070',
  '45.76.134.89:5050',
];

const botNames = [
  'viewer_alpha', 'viewer_beta', 'viewer_gamma', 'viewer_delta',
  'viewer_epsilon', 'viewer_zeta', 'viewer_eta', 'viewer_theta',
  'viewer_iota', 'viewer_kappa', 'viewer_lambda', 'viewer_mu',
  'viewer_nu', 'viewer_xi', 'viewer_omicron', 'viewer_pi',
  'viewer_rho', 'viewer_sigma', 'viewer_tau', 'viewer_upsilon',
];

const platforms: Platform[] = ['twitch', 'youtube', 'kick', 'trovo'];

const targetChannels: Record<Platform, string[]> = {
  twitch: ['xqc', 'shroud', 'pokimane', 'summit1g', 'timthetatman'],
  youtube: ['MrBeast', 'PewDiePie', 'Markiplier', 'Dream', 'Technoblade'],
  kick: ['xQc', 'Adin_Ross', 'Trainwreckstv', 'Amouranth', 'Kai'],
  trovo: ['BigBoody', 'Kurtis', 'Lacy', 'PikaPwn', 'Tylers'],
};

export function generateBots(count: number): Bot[] {
  const bots: Bot[] = [];
  const statuses: Bot['status'][] = ['online', 'connecting', 'idle', 'error', 'offline'];
  const weights = [0.5, 0.15, 0.15, 0.05, 0.15];

  for (let i = 0; i < count; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const channels = targetChannels[platform];
    const rand = Math.random();
    let cumulative = 0;
    let status: Bot['status'] = 'offline';
    for (let j = 0; j < weights.length; j++) {
      cumulative += weights[j];
      if (rand < cumulative) {
        status = statuses[j];
        break;
      }
    }

    bots.push({
      id: uuid(),
      name: botNames[i % botNames.length] + (i >= botNames.length ? `_${Math.floor(i / botNames.length)}` : ''),
      platform,
      status,
      targetChannel: channels[Math.floor(Math.random() * channels.length)],
      viewers: status === 'online' ? Math.floor(Math.random() * 50) + 1 : 0,
      uptime: status === 'online' ? Math.floor(Math.random() * 7200) : 0,
      messagesSent: Math.floor(Math.random() * 200),
      lastActive: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      proxy: proxies[Math.floor(Math.random() * proxies.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
    });
  }

  return bots;
}

export function generateLogEntry(bots: Bot[]): LogEntry {
  const types: LogEntry['type'][] = ['info', 'success', 'warning', 'error', 'chat'];
  const type = types[Math.floor(Math.random() * types.length)];

  const messages: Record<LogEntry['type'], string[]> = {
    info: [
      'Heartbeat sent to proxy server',
      'Reconnecting to IRC...',
      'Viewer count updated',
      'Session refreshed',
      'Proxy rotation scheduled',
      'DNS lookup completed',
      'WebSocket connection established',
    ],
    success: [
      'Successfully joined channel',
      'Message delivered',
      'Connection established',
      'Authentication successful',
      'Viewers boosted successfully',
      'Proxy validated',
    ],
    warning: [
      'Rate limit approaching',
      'Proxy response slow (>2s)',
      'Token expiring in 5 minutes',
      'High memory usage detected',
      'Connection unstable',
    ],
    error: [
      'Connection timeout',
      'Proxy rejected',
      'Authentication failed',
      'Rate limited - backing off',
      'Channel not found',
      'Invalid token',
    ],
    chat: [
      'PogChamp let\'s gooo',
      'GG EZ',
      'First time watching, love the content!',
      'Can you play Valorant next?',
      'LUL',
      'Hello from Germany!',
      'This stream is fire 🔥',
      'W stream',
      'How long has this been going on?',
      'Kappa',
    ],
  };

  const onlineBots = bots.filter(b => b.status === 'online');
  const bot = onlineBots.length > 0 ? onlineBots[Math.floor(Math.random() * onlineBots.length)] : bots[0];

  return {
    id: uuid(),
    timestamp: new Date().toISOString(),
    type,
    botId: bot?.id,
    botName: bot?.name,
    platform: bot?.platform,
    message: messages[type][Math.floor(Math.random() * messages[type].length)],
  };
}

export function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function getPlatformColor(platform: Platform): string {
  switch (platform) {
    case 'twitch': return 'text-purple-400';
    case 'youtube': return 'text-red-400';
    case 'kick': return 'text-green-400';
    case 'trovo': return 'text-blue-400';
  }
}

export function getPlatformBg(platform: Platform): string {
  switch (platform) {
    case 'twitch': return 'bg-purple-500/20 border-purple-500/30';
    case 'youtube': return 'bg-red-500/20 border-red-500/30';
    case 'kick': return 'bg-green-500/20 border-green-500/30';
    case 'trovo': return 'bg-blue-500/20 border-blue-500/30';
  }
}

export function getStatusColor(status: Bot['status']): string {
  switch (status) {
    case 'online': return 'bg-emerald-500';
    case 'connecting': return 'bg-yellow-500';
    case 'idle': return 'bg-blue-500';
    case 'error': return 'bg-red-500';
    case 'offline': return 'bg-zinc-500';
  }
}

export function getStatusLabel(status: Bot['status']): string {
  switch (status) {
    case 'online': return 'Online';
    case 'connecting': return 'Connecting';
    case 'idle': return 'Idle';
    case 'error': return 'Error';
    case 'offline': return 'Offline';
  }
}
