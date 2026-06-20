export type Platform = 'facebook' | 'youtube' | 'tiktok';
export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5';
export type PostStatus = 'draft' | 'scheduled' | 'published';

export interface Post {
  id: string;
  content: string;
  mediaUri?: string;
  platforms: Platform[];
  format: AspectRatio;
  scheduledAt: string | null;
  status: PostStatus;
  createdAt: string;
}

export interface Account {
  id: string;
  platform: Platform;
  username: string;
  handle: string;
  followers: number;
  connected: boolean;
}

export const PLATFORM_FORMATS: Record<Platform, AspectRatio[]> = {
  facebook: ['1:1', '4:5', '16:9', '9:16'],
  youtube: ['16:9', '9:16'],
  tiktok: ['9:16'],
};

export const FORMAT_LABELS: Record<AspectRatio, string> = {
  '9:16': 'Vertical',
  '16:9': 'Landscape',
  '1:1': 'Square',
  '4:5': 'Portrait',
};

export const PLATFORM_NAMES: Record<Platform, string> = {
  facebook: 'Facebook',
  youtube: 'YouTube',
  tiktok: 'TikTok',
};

export const PLATFORM_COLORS: Record<Platform, string> = {
  facebook: '#1877F2',
  youtube: '#FF0000',
  tiktok: '#69C9D0',
};

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc1',
    platform: 'facebook',
    username: 'Creative Studio',
    handle: '@creativestudio',
    followers: 12547,
    connected: true,
  },
  {
    id: 'acc2',
    platform: 'youtube',
    username: 'Creative Studio',
    handle: '@creativestudio',
    followers: 48200,
    connected: true,
  },
  {
    id: 'acc3',
    platform: 'tiktok',
    username: 'creativestudio_',
    handle: '@creativestudio_',
    followers: 95100,
    connected: false,
  },
];

export const MOCK_POSTS: Post[] = [
  {
    id: Date.now().toString() + '1',
    content: 'Launching something massive this week. The announcement that changes everything is almost here.',
    platforms: ['facebook', 'youtube'],
    format: '16:9',
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: Date.now().toString() + '2',
    content: 'Behind the scenes of our latest creative shoot. Energy was absolutely electric.',
    platforms: ['tiktok'],
    format: '9:16',
    scheduledAt: new Date(Date.now() + 172800000).toISOString(),
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: Date.now().toString() + '3',
    content: 'Every great creator started as a beginner. Keep pushing. Keep creating. The breakthrough is closer than you think.',
    platforms: ['facebook', 'tiktok', 'youtube'],
    format: '1:1',
    scheduledAt: null,
    status: 'published',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];
