export type Platform = 'twitch' | 'youtube' | 'kick' | 'trovo';

export type BotStatus = 'online' | 'connecting' | 'idle' | 'error' | 'offline';

export interface Bot {
  id: string;
  name: string;
  platform: Platform;
  status: BotStatus;
  targetChannel: string;
  viewers: number;
  uptime: number; // seconds
  messagesSent: number;
  lastActive: string;
  proxy: string;
  region: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'chat';
  botId?: string;
  botName?: string;
  platform?: Platform;
  message: string;
}

export interface DashboardStats {
  totalBots: number;
  activeBots: number;
  totalViewers: number;
  messagesSent: number;
  uptime: string;
  platforms: Record<Platform, number>;
}

export type TabType = 'dashboard' | 'bots' | 'composer' | 'logs' | 'settings';
